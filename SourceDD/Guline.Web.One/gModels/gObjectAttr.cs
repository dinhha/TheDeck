using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Guline.Web.One.gModels
{
    [PetaPoco.TableName("gObjectAttr")]
    [PetaPoco.PrimaryKey("ID")]
    public class gObjectAttr
    {
        public long ID { get; set; }
        public Nullable<long> gObjectGroupID { get; set; }

     
        public string AttrName { get; set; }
        public string AttrTitle { get; set; }
        public int AttrType { get; set; }
        public string AttrValue { 
            get; 
            set;
        }
        [PetaPoco.ResultColumn]
        public string[] AttrValueArray
        {
            get
            {
                if (!String.IsNullOrEmpty(AttrValue) && AttrType==9)
                {    
                    return AttrValue.Split(',');
                }
                else
                    return new string[0];
            }
        }
        public bool AttrRequired { get; set; }
        public string AttrConfig { get; set; }
        [PetaPoco.ResultColumn]
        public CustomObject CustomObjects { get
            {
               //Type=8--- Object 
                if (AttrType == 8)
                { 
                return System.Web.Helpers.Json.Decode<CustomObject>(AttrConfig);
                }
                else
                {
                    return new CustomObject();
                }
            }
        }
        [PetaPoco.ResultColumn]
        public Object CustomObjectsValue
        {
            get
            {
                //Type=8--- Object 
                if (AttrType == 8 && !String.IsNullOrEmpty(AttrValue))
                {
                    return System.Web.Helpers.Json.Decode <Object>(AttrValue);
                }
                else
                {
                    return new Object();
                }
            }
        }

        [PetaPoco.ResultColumn]
        public string[] DataConfig {
            get {
                //Type =7 -- Dropdown
                if (!String.IsNullOrEmpty(AttrConfig) && AttrType==7)
                {
                    return AttrConfig.Split(',');
                }
                else
                {
                    return new string[0];
                }
            }
        }
        //AttrOrder
        public Nullable<long> AttrOrder { get; set; }

        public DateTime CreateDate { get; set; }
        public string CreatedBy { get; set; }
        public Nullable<DateTime> LastUpdateDate { get; set; }
        public string LastUpdateBy { get; set; }
        public int Status { get; set; }

        public long gObjectDataID { get; set; }
    }
    public class CustomObject
    {
        public string DataType { get; set; }
        public string DataConfig { get; set; }
        public string[] ArrayConfig { 
            get {
                if (!String.IsNullOrEmpty(DataConfig))
                    return DataConfig.Split(',');
                else
                    return new string[0];
        
            } 
        }
        public string ParentType { get; set; }
        public string ParentConfig { get; set; }
        public string[] ParentArrayConfig { get {
            if(!String.IsNullOrEmpty(ParentConfig))
            return ParentConfig.Split(',');
             else
                    return new string[0];
        } }
    }
    public class CustomObjectValue
    {
        public string Color { get; set; }
        public string[] Size { get; set; }
    }
}