using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Guline.Web.One.gModels
{
    [PetaPoco.TableName("gObjectGroup")]
    [PetaPoco.PrimaryKey("ID")]
    public class gObjectGroup
    {
        [Required]
        public string ID { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Title { get; set; }
        [Required]
        public DateTime CreatedDate { get; set; }

        [Required]
        public int Status { get; set; }

        public bool isExpandMenu { get; set; }

        public bool justOne { get; set; }

        public bool hasChild { get; set; }
        public bool hasAdd { get; set; }
        public bool hasOrder { get; set; }
        public long gOrganizeID { get; set; }

        public int gOrder { get; set; }

        public bool gCanSale { get; set; }

        public bool gJustAttr { get; set; }
    }
}