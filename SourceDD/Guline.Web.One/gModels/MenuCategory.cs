using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Guline.Web.One.gModels
{
    [PetaPoco.TableName("MenuCategory")]
    [PetaPoco.PrimaryKey("ID")]
    public class MenuCategory
    {
        public long ID { get; set; }
        public string Name { get; set; }
        public string GroupName { get; set; }
        public string Position { get; set; }
    }

    [PetaPoco.TableName("MenuDetails")]
    [PetaPoco.PrimaryKey("ID")]
    public class MenuDetails
    {
        public long ID { get; set; }
        public long MenuID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Price { get; set; }
        public string SubItems { get; set; }
    }
}