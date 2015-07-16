using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Guline.Web.One.gModels
{
    [PetaPoco.TableName("User")]
    [PetaPoco.PrimaryKey("ID")]
    public class User
    {
        public long ID { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Image { get; set; }
        public string Password { get; set; }
        public string PasswordHint { get; set; }
        public Nullable<DateTime> ActiveDate { get; set; }
        public long GroupID { get; set; }
        [PetaPoco.ResultColumn]
        public string GroupName { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public int Status { get; set; }
        public long gOrganizeID { get; set; }
        public string Gender { get; set; }
        public string Province { get; set; }
        public string District { get; set; }
        [PetaPoco.Ignore]
        public DateTime CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> LastUpdateDate { get; set; }
        public string LastUpdateBy { get; set; }

    }
    public class UserFillter
    {
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}