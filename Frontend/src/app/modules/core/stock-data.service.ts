import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StockDataService {

  constructor() {
    this.connectedUsers = 0;
  }

  connectedUsers: number;
}
