using SignalRStocksBackend.Entities;
using SignalRStocksBackend.Hubs;
using SignalRStocksBackend.Services;

var builder = WebApplication.CreateBuilder(args);

string corsKey = "_myCorsKey";

// Add services to the container.
builder.Services.AddSingleton<StockContext>();
builder.Services.AddSingleton<StockService>();
builder.Services.AddSingleton<StockTickerService>();
builder.Services.AddSingleton<StockHub>();

builder.Services.AddControllers();
builder.Services.AddSignalR();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
	app.UseDeveloperExceptionPage();
	app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(options =>
{
	options.SetIsOriginAllowed(_ => true).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
});

app.UseRouting();

app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
	endpoints.MapControllers();
	endpoints.MapHub<StockHub>("/stock");
});

app.Run();
