import { Injectable } from '@angular/core';
import DepotDto from "../../../models/DepotDto";
import TransactionDto from "../../../models/TransactionDto";

@Injectable({
  providedIn: 'root'
})
export class StockDataService {

  constructor() {
    this.connectedUsers = 0;
    this.userCash = 0;
    this.userShares = [];
    this.transactions = [];
  }

  connectedUsers: number;
  userCash: number;
  userShares: DepotDto[];
  transactions: TransactionDto[];
}
