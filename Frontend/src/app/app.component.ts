import {Component, ViewChild} from '@angular/core';
import {SignalRService} from "./modules/core/signal-r.service";
import {StockDataService} from "./modules/core/stock-data.service";
import {Observable} from "rxjs";
import ShareTickDto from "../models/ShareTickDto";
import {BaseChartDirective} from "ng2-charts";
import {ChartConfiguration} from "chart.js";


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

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [],
  };

  constructor(private signalr: SignalRService, public dataService: StockDataService) {
    this.newStockData = signalr.onNewStocks();

    this.newStockData.subscribe(x => {
      this.currentStockData = x;
      this.selectedShare = x[0];

      let index = 0;
      this.chartData.labels?.push(new Date().toLocaleString('en', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false}));
      this.currentStockData.slice(0, 5).forEach(x => {
        if (this.chartData.datasets[index]) {
          this.chartData.datasets[index].data.push(x.val);
        } else {
          this.chartData.datasets[index] = {
            label: x.name,
            data: [x.val],
          }
        }
        index++;
      });

      this.chart?.update();
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
