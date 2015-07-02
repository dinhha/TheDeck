using System.Web.Mvc;

namespace Guline.Web.One.Areas.Admin
{
    public class AdminAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "Admin";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                name: "adminAngularCatchAllRoute",
                 url: System.Configuration.ConfigurationManager.AppSettings["AdminUrlStart"] + "/{*any}",
                 defaults: new { controller = "Admin", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
