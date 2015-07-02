using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Guline.Web.One.gModels
{
    public class ProvinceModel
    {
        public int ID { get; set; }
        public string Province { get; set; }
        public int Status { get; set; }
        public int SortOrder { get; set; }
    }
    public class DistrictModel
    {
        public int ID { get; set; }
        public int ProvinceID { get; set; }
        public string District { get; set; }
        public int Status { get; set; }
    }
}