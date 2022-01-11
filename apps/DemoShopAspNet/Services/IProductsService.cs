using DemoShopAspNet.Models;

namespace DemoShopAspNet.Services;

public interface IProductsService
{
    Task<IEnumerable<Product>> GetProductsAsync();
}
