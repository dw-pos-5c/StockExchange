import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import {Observable, share, Subject} from "rxjs";
import ShareTickDto from "../../../models/ShareTickDto";
import {StockDataService} from "./stock-data.service";

@Injectable()
export class SignalRService {

  private subject = new Subject<ShareTickDto[]>();
  private hubConnection: HubConnection;

  public connected = false;

  constructor(private dataService: StockDataService) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5000/stock')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('newConnection', (val) => {
      console.log('newConnection', val);
      dataService.connectedUsers = val
    });

    this.hubConnection.on('transactionReceived', (transaction) => {
      dataService.transactions.push(transaction);
    });
  }

  private username = '';
  public connect(username: string): void {
    this.hubConnection.start()
      .then(async () => {
        this.connected = true;
        await this.update();
      })
      .catch((error) => console.log(error));
    this.username = username;

  }

  public disconnect(): void {
    this.hubConnection.stop()
      .then(() => this.connected = false)
      .catch((error) => console.log(error));

    this.dataService.userCash = 0;
  }

  public onNewStocks(): Observable<ShareTickDto[]> {
    this.hubConnection.on('newStocks', (val) => this.subject.next(val))
    return this.subject.asObservable();
  }

  async buy(username: string, shareName: string, amount: number) {
    const success = await this.hubConnection.invoke('BuyShare', username, shareName, amount, true);
    if (!success) console.log('Failed to buy Share');
    else {
      this.update();
    }
  }

  async sell(username: string, shareName: string, amount: number) {
    const success = this.hubConnection.invoke('BuyShare', username, shareName, amount, false);
    if (!success) console.log('Failed to sell Share');
    else {
      this.update();
    }
  }

  async update() {
    this.dataService.userCash = await this.hubConnection.invoke('GetCash', this.username);
    this.dataService.userShares = await this.hubConnection.invoke('GetUserShares', this.username);
  }
}
