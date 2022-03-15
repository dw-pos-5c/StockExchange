import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import {Observable, Subject} from "rxjs";
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
  }

  private username = '';
  public connect(username: string): void {
    this.hubConnection.start()
      .then(async () => {
        this.connected = true;
        this.dataService.userCash = await this.hubConnection.invoke('GetCash', username);
        this.dataService.userShares = await this.hubConnection.invoke('GetUserShares', username);
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
}
