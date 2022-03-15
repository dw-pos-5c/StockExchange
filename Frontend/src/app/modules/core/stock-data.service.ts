import { Injectable } from '@angular/core';
import DepotDto from "../../../models/DepotDto";

@Injectable({
  providedIn: 'root'
})
export class StockDataService {

  constructor() {
    this.connectedUsers = 0;
    this.userCash = 0;
    this.userShares = [];
  }

  connectedUsers: number;
  userCash: number;
  userShares: DepotDto[];
}
