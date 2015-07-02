using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Guline.Web.One.gModels
{

    [PetaPoco.TableName("gObject")]
    [PetaPoco.PrimaryKey("ID")]
    public class gObject
    {
        public long ID { get; set; }
        public long gGroupID { get; set; }


        public string Slug { get; set; }

        public string Title { get; set; }
        public int Status { get; set; }
        [PetaPoco.Ignore]
        public DateTime CreateDate { get; set; }
        public string CreatedBy { get; set; }
        [PetaPoco.ResultColumn]
        public Nullable<DateTime> LastUpdateDate { get; set; }
        public string LastUpdateBy { get; set; }

        [PetaPoco.ResultColumn]
        public string gObjectName { get; set; }

        [PetaPoco.ResultColumn]
        public string gObjectDisplayName { get; set; }

        [PetaPoco.ResultColumn]
        public virtual List<gObjectAttr> Attrs { get; set; }
        [PetaPoco.ResultColumn]
        public bool ckselected { get; set; }

        public string ParentID { get; set; }
        [PetaPoco.ResultColumn]
        public List<string> ParentName { get; set; }

        [PetaPoco.ResultColumn]
        public virtual gObject Parent { get; set; }

        [PetaPoco.ResultColumn]
        public virtual List<gObject> Childrens { get; set; }

        [PetaPoco.ResultColumn]
        public virtual PetaPoco.Page<gObject> PageChildrens { get; set; }

        [PetaPoco.ResultColumn]
        public bool hasChild { get; set; }

        public Nullable<long> OwnerUserID { get; set; }

        public Nullable<long> gOrder { get; set; }



        public string gSeo { get; set; }


        public string gImage { get; set; }

        public string gDescription { get; set; }


        public string gKeyword { get; set; }



        [PetaPoco.ResultColumn]
        public long ChildCount { get; set; }

        [PetaPoco.ResultColumn]
        public virtual List<gObject> Relatives { get; set; }
        [PetaPoco.ResultColumn]
        public bool gCanSale { get; set; }
        [PetaPoco.ResultColumn]
        public bool gIsCategory { get; set; }
        [PetaPoco.ResultColumn]
        public bool gJustAttr { get; set; }    

        public bool gEnabled { get; set; }
    }
}