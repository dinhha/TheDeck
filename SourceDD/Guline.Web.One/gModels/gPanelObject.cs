using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Guline.Web.One.gModels
{
    public class gPanelObject
    {
        public string gObjectName { get; set; }
        public string gObjectDisplayName { get; set; }

        public List<gObject> Categorys { get; set; }

        public List<gObject> ListBestBuy { get; set; }

        public List<gObject> ListShowHome { get; set; }
    }
}