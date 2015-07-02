using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Guline.Web.One
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            //bai-viet-test-i117
            routes.MapRoute(
              "ObjectItem",
              "{Title}-i{ID}",
              new { controller = "Home", action = "Index" }
            );
            routes.MapRoute(
             name: "AngularCatchAllRoute",
             url: "{*any}",
              defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}