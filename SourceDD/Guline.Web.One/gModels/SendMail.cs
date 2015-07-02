using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Guline.Web.One.gModels
{
    public class SendMail
    {
        public long TemplateID { get; set; }

        public List<Receiver> Receivers { get; set; }
    }
}