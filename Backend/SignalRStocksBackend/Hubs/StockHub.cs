using Microsoft.AspNetCore.SignalR;
using SignalRStocksBackend.DTOs;
using SignalRStocksBackend.Services;

namespace SignalRStocksBackend.Hubs;

public class StockHub: Hub
{
    private StockService stockService;

    public StockHub(StockService stockService)
    {
        this.stockService = stockService;
    }

    private int Connections { get; set; }

    public override Task OnConnectedAsync()
    {
        Connections++;
        Clients.All.SendAsync("newConnection", Connections);
        return base.OnConnectedAsync();
    }

    public override Task OnDisconnectedAsync(Exception exception)
    {
        Connections--;
        Clients.All.SendAsync("newConnection", Connections);
        return base.OnDisconnectedAsync(exception);
    }

    public bool BuyShare(string username, string shareName, int amount, bool isBuy)
    {
        var dto = stockService.AddTransaction(username, shareName, amount, isBuy);
        if (dto == null) return false;
        TransactionDto? transaction = new TransactionDto
        {
            Amount = amount,
            IsUserBuy = isBuy,
            Price = dto.UnitPrice,
            ShareName = shareName,
            Username = username,
            UnitsInStockNow = dto?.Share?.UnitsInStock ?? 0,
            Timestamp = dto?.Timestamp.ToLongTimeString() ?? "",
        };
        Clients.All.SendAsync("transactionReceived", transaction);
        return true;
    }


    public double GetCash(string username) {
        return stockService.GetCash(username);
    }

    public List<DepotDto> GetUserShares(string username) {
        if (!username.Any()) return new List<DepotDto>();
        return stockService.GetUserShares(username).Select(x => new DepotDto
        {
            Amount = x.Amount,
            ShareName = x?.Share?.Name ?? "",
        }).ToList();
    }
}
