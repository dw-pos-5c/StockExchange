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

    public void BuyShare(string username, string shareName, int amount)
    {
        var dto = stockService.AddTransaction(username, shareName, amount, true);
        TransactionDto? transaction = new TransactionDto().CopyPropertiesFrom(dto);
        Clients.All.SendAsync("transactionReceived", transaction);
    }

    public void SellShare(string username, string shareName, int amount)
    {
        var dto = stockService.AddTransaction(username, shareName, amount, false);
        TransactionDto? transaction = new TransactionDto().CopyPropertiesFrom(dto);
        Clients.All.SendAsync("transactionReceived", transaction);
    }
}
