using SignalRStocksBackend.DTOs;
using SignalRStocksBackend.Entities;

namespace SignalRStocksBackend.Services;

public class StockService
{
    private readonly StockContext db;

    public StockService(StockContext db)
    {
        this.db = db;
    }

    public Transaction AddTransaction(string username, string shareName, int amount, bool isBuy)
    {
        var share = db.Shares.SingleOrDefault(x => x.Name.Equals(shareName));
        var user = db.Users.SingleOrDefault(x => x.Name.Equals(username));
        if (share == null || user == null) return null;

        var transactionPrice = amount * share.StartPrice;

        var userShare = db.UserShares.SingleOrDefault(x => x.User.Equals(user) && x.Share.Equals(share));

        if (isBuy)
        {
            if (transactionPrice > user.Cash) return null;

            if (userShare == null)
            {
                db.UserShares.Add(new UserShare
                {
                    User = user,
                    Share = share,
                    Amount = amount,
                });
            } else
            {
                userShare.Amount += amount;
            }

            user.Cash -= transactionPrice;
            db.SaveChanges();
        } else
        {
            if (userShare == null || userShare.Amount < amount) return null;

            if (userShare.Amount == amount)
            {
                db.UserShares.Remove(userShare);
            } else
            {
                userShare.Amount -= amount;
            }

            user.Cash += transactionPrice;
            db.SaveChanges();
        }

        var transaction = new Transaction
        {
            Share = share,
            User = user,
            Amount = amount,
            IsUserBuy = isBuy,
            Timestamp = DateTime.Now,
        };
        db.Transactions.Add(transaction);
        db.SaveChanges();

        return transaction;
    }

    internal List<UserShare> GetUserShares(string username)
    {
        var user = db.Users.SingleOrDefault(x => x.Name.Equals(username));
        if (user == null) return null;
        return db.UserShares.Where(x => x?.User?.Equals(user) ?? false).ToList();
    }

    public double GetCash(string username)
    {
        var user = db.Users.SingleOrDefault(x => x.Name == username);
        return user?.Cash ?? 0;
    }
}
