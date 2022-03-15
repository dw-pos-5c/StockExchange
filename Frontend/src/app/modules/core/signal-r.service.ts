import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import {Observable, Subject} from "rxjs";
import ShareTickDto from "../../../models/ShareTickDto";
import {StockDataService} from "./stock-data.service";

@Injectable()
export class SignalRService {

  private subject = new Subject<ShareTickDto[]>();
  private hubConnection: HubConnection;

  public connected = false;

  constructor(dataService: StockDataService) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl('http://localhost:5000/stock')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.on('newConnection', (val) => {
      console.log('newConnection', val);
      dataService.connectedUsers = val
    });
  }

  public connect(): void {
    this.hubConnection.start()
      .then(() => this.connected = true)
      .catch((error) => console.log(error));
  }

  public disconnect(): void {
    this.hubConnection.stop()
      .then(() => this.connected = false)
      .catch((error) => console.log(error));
  }

  public onNewStocks(): Observable<ShareTickDto[]> {
    this.hubConnection.on('newStocks', (val) => this.subject.next(val))
    return this.subject.asObservable();
  }
}
