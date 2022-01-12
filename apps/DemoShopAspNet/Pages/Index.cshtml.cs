using DemoShopAspNet.Configuration;
using DemoShopAspNet.Models;
using DemoShopAspNet.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Options;
using TezosPayments;

namespace DemoShopAspNet.Pages;

public class IndexModel : PageModel
{
    public AppConfiguration AppConfiguration { get; }

    public IEnumerable<Product> Products { get; private set; } = default!;

    [BindProperty]
    public int? RequestedToBuyProductId { get; set; } = null;

    private IProductsService ProductsService { get; }
    private ITezosPayments TezosPayments { get; }

    public IndexModel(
        IOptions<AppConfiguration> appConfiguration,
        IProductsService productsService,
        ITezosPayments tezosPayments
    )
    {
        AppConfiguration = appConfiguration?.Value ?? throw new ArgumentNullException(nameof(appConfiguration));
        ProductsService = productsService ?? throw new ArgumentNullException(nameof(productsService));
        TezosPayments = tezosPayments ?? throw new ArgumentNullException(nameof(tezosPayments));
    }

    public async Task OnGetAsync()
    {
        Products = await ProductsService.GetProductsAsync();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (RequestedToBuyProductId == null)
            return NotFound("Requested product id is null");

        var product = await ProductsService.GetProductByIdAsync(RequestedToBuyProductId.Value);
        if (product == null)
            return NotFound($"Product not found by ${RequestedToBuyProductId}");

        var payment = await TezosPayments.CreatePaymentAsync(new(product.Price.Value.ToString())
        {
            Data = new {
                Product = product.Name
            }
        });

        return Redirect(payment.Url.AbsoluteUri);
    }
}
