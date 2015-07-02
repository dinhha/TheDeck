using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Guline.Web.One.gModels
{
    [PetaPoco.TableName("gObjectData")]
    [PetaPoco.PrimaryKey("ID")]
    public class gObjectData
    {
        public long ID { get; set; }
        public long gObjectID { get; set; }
        public string gValue { get; set; }
        public long gAttrID { get; set; }

        public DateTime CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> LastUpdateDate { get; set; }
        public string LastUpdateBy { get; set; }

    }
}