export default class TransactionDto {
  username: string;
  shareName: string;
  amount: number;
  price: number;
  unitsInStockNow: number;
  isUserBuy: boolean;
  timestamp: string;

  constructor(username: string, shareName: string, amount: number, price: number, unitsInStockNow: number, isUserBuy: boolean, timestamp: string) {
    this.username = username;
    this.shareName = shareName;
    this.amount = amount;
    this.price = price;
    this.unitsInStockNow = unitsInStockNow;
    this.isUserBuy = isUserBuy;
    this.timestamp = timestamp;
  }
}
