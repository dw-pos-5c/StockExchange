import { Component } from '@angular/core';
import {SignalRService} from "./modules/core/signal-r.service";
import {StockDataService} from "./modules/core/stock-data.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'StockExchange';

  username = '';

  constructor(private signalr: SignalRService, public dataService: StockDataService) {

  }

  getConnectedStatus(): boolean {
    return this.signalr.connected;
  }

  connect(): void {
    this.signalr.connect();
  }

  disconnect(): void {
    this.signalr.disconnect();
  }

}
