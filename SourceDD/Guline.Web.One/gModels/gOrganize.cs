using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Guline.Web.One.gModels
{
    public class gOrganize
    {
        public long ID { get; set; }

        public string Name { get; set; }

        public int Status { get; set; }

        public DateTime CreateDate { get; set; }

        public string TokenKey { get; set; }
    }
}