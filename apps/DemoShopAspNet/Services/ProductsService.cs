using DemoShopAspNet.Models;

namespace DemoShopAspNet.Services;

public class ProductsService : IProductsService
{
    private static readonly IReadOnlyList<Product> products = new List<Product>()
    {
        new(0, "Fitness Bracelet", new Money(9.99m, "XTZ"), "~/images/products/0-fitness-bracelet.jpg"),
        new(1, "Watch", new Money(19.99m, "XTZ"), "~/images/products/1-watch.jpg"),
        new(2, "Smart Speaker", new Money(59.77m, "XTZ"), "~/images/products/2-smart-speaker.jpg"),
    }.AsReadOnly();

    public Task<Product?> GetProductByIdAsync(int id) => Task.FromResult(products.FirstOrDefault(p => p.Id == id));

    public Task<IEnumerable<Product>> GetProductsAsync() => Task.FromResult<IEnumerable<Product>>(products);
}
