using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Guline.Web.One.DInject;

namespace Guline.Web.One.Controllers
{
    public class HomeController : GulineController
    {
        private IObjectGroup sc;
        public HomeController(IObjectGroup service)
        {
            sc = service;
            this.Organize = sc.getOrganize(this.sOrganize);
        }
        public ActionResult Index(string ID)
        {
            var config = sc.getOneObject("config", Organize.ID);

            ViewBag.baseConfig = config;

            string urlbase = Request.Url.GetLeftPart(UriPartial.Authority);

            ViewBag.BaseData = "{'isAuth':" + User.Identity.IsAuthenticated.ToString().ToLower() + ",'appPath':'" + System.Configuration.ConfigurationManager.AppSettings["AppPath"] + "','appRouteMain':'" + System.Configuration.ConfigurationManager.AppSettings["UrlStart"] + "','baseAppResouceUrl':'" + urlbase + "/" + System.Configuration.ConfigurationManager.AppSettings["AppPath"] + "','baseWebUrl':'" + urlbase + "'}";

            if (ID != null)
            {
                long idmain = 0;
                try
                {
                    idmain = long.Parse(ID);
                }
                catch
                { }
                ViewBag.obj = sc.findObjectByID(idmain);
            }

            return View();
        }

    }
}
