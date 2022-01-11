using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Options;

namespace DemoShopAspNet.Pages;

public class IndexModel : PageModel
{
    public Configuration.AppConfiguration AppConfiguration { get; }

    public IndexModel(IOptions<Configuration.AppConfiguration> appConfiguration)
    {
        AppConfiguration = appConfiguration?.Value ?? throw new ArgumentNullException(nameof(appConfiguration));
    }
}
