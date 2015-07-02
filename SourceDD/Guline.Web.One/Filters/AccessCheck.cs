using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Guline.Web.One.Filters
{
    public class AccessChecker : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (filterContext.HttpContext.Session["Organize"] == null)
            {
                filterContext.Result = new RedirectToRouteResult(new
                         RouteValueDictionary(new { controller = "Error", action = "AccessDenied" }));
            }

        }
    }
}