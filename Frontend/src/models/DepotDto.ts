export default class DepotDto {
  shareName: string;
  amount: number;

  constructor(shareName: string, amount: number) {
    this.shareName = shareName;
    this.amount = amount;
  }
}
