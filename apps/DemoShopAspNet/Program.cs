using DemoShopAspNet.Configuration;
using DemoShopAspNet.Services;
using TezosPayments.DependencyInjection;
using TezosPayments.DependencyInjection.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<AppConfiguration>(builder.Configuration);
builder.Services.AddTransient<IProductsService, ProductsService>();
builder.Services.AddRazorPages();

var tezosPaymentsOptions = builder.Configuration
    .GetSection("TezosPayments")
    .Get<TezosPaymentsOptions>();
builder.Services.AddTezosPayments(tezosPaymentsOptions);

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.MapRazorPages();

app.Run();
