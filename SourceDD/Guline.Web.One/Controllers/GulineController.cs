using Guline.Web.One.DInject;
using Guline.Web.One.gModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Guline.Web.One.Controllers
{
    public class GulineController : Controller
    {
        protected gOrganize Organize;
        protected string sOrganize;
        public GulineController()
        {


            sOrganize = System.Web.HttpContext.Current.Request.Url.Host;

            //just for culture

            //if (System.Web.HttpContext.Current.Request.QueryString["token"] == null)
            //{
            //    if (System.Web.HttpContext.Current.Session["Organize"] != null)
            //    {
            //        Organize = (gModels.gOrganize)System.Web.HttpContext.Current.Session["Organize"];
            //    }
            //    else
            //    {
            //        System.Web.HttpContext.Current.Response.Redirect("~/", true);
            //    }
            //}

        }
    }
}
