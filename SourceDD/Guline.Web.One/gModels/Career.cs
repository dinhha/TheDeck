using PetaPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Guline.Web.One.gModels
{
    [TableName("gCareer")]
    [PrimaryKey("ID")]
    public class Career
    {
        public long ID { get; set; }
        public string availableDate { get; set; }
        public long salary { get; set; }
        public bool onlyJob { get; set; }
        public string position { get; set; }
        public string title { get; set; }
        public string firstName { get; set; }
        public string surName { get; set; }
        public string mobile { get; set; }
        public string email { get; set; }
        public string address { get; set; }
        public string birdthDate { get; set; }
        public string idNum { get; set; }
        public string cvFile { get; set; }
        public string photo { get; set; }
    }
}