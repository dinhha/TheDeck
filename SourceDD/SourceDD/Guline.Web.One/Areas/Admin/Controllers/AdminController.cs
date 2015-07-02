using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Guline.Web.One.Controllers;

namespace Guline.Web.One.Areas.Admin.Controllers
{
    public class AdminController : GulineController
    {
        //
        // GET: /Admin/Admin/

        public ActionResult Index()
        {
            string urlbase = Request.Url.GetLeftPart(UriPartial.Authority);

            ViewBag.BaseData = "{'isAuth':" + User.Identity.IsAuthenticated.ToString().ToLower() + ",'appPath':'" + System.Configuration.ConfigurationManager.AppSettings["AdminAppPath"] + "','appRouteMain':'" + System.Configuration.ConfigurationManager.AppSettings["AdminUrlStart"] + "','baseAppResouceUrl':'" + urlbase + "/" + System.Configuration.ConfigurationManager.AppSettings["AdminAppPath"] + "','baseWebUrl':'" + urlbase + "','user':'"+sOrganize+"'}";
            return View();
        }

    }
}
