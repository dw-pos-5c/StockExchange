import { Component } from '@angular/core';
import {SignalRService} from "./modules/core/signal-r.service";
import {StockDataService} from "./modules/core/stock-data.service";
import {Observable} from "rxjs";
import ShareTickDto from "../models/ShareTickDto";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'StockExchange';

  username = '';

  newStockData: Observable<ShareTickDto[]>;

  userStockData = [];
  currentStockData: ShareTickDto[] = [];
  selectedShare!: ShareTickDto;

  constructor(private signalr: SignalRService, public dataService: StockDataService) {
    this.newStockData = signalr.onNewStocks();

    this.newStockData.subscribe(x => {
      this.currentStockData = x;
      this.selectedShare = x[0];
    });
  }

  getConnectedStatus(): boolean {
    return this.signalr.connected;
  }

  connect(): void {
    this.signalr.connect(this.username);
  }

  disconnect(): void {
    this.signalr.disconnect();
  }

}
