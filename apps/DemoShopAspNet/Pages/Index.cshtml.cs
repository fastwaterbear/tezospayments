using DemoShopAspNet.Configuration;
using DemoShopAspNet.Models;
using DemoShopAspNet.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Options;

namespace DemoShopAspNet.Pages;

public class IndexModel : PageModel
{
    public AppConfiguration AppConfiguration { get; }

    public IEnumerable<Product> Products { get; private set; } = default!;

    [BindProperty]
    public int? RequestedToBuyProductId { get; set; } = null;

    private IProductsService ProductsService { get; }

    public IndexModel(
        IOptions<AppConfiguration> appConfiguration,
        IProductsService productsService
    )
    {
        AppConfiguration = appConfiguration?.Value ?? throw new ArgumentNullException(nameof(appConfiguration));
        ProductsService = productsService ?? throw new ArgumentNullException(nameof(productsService));
    }

    public async Task OnGetAsync()
    {
        Products = await ProductsService.GetProductsAsync();
    }

    public IActionResult OnPostAsync()
    {
        // TODO: use a payment url
        return RedirectToPage("Index");
    }
}
