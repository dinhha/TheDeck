using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PetaPoco;

namespace Guline.Web.One.Models
{
    public class mContext : Database
    {
        public mContext()
            : base("DefaultConnection")
        {

        }


    }
}