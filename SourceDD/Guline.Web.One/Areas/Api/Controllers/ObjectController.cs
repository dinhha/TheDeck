using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Guline.Web.One.Controllers;
using Guline.Web.One.DInject;
using System.Net.Mail;
using Guline.Web.One.gModels;
using Newtonsoft.Json;
using System.Web.Script.Serialization;

namespace Guline.Web.One.Areas.Api.Controllers
{

    public class ObjectController : GulineController
    {
        private IObjectGroup sc;
        public ObjectController(IObjectGroup service)
        {
            sc = service;
            this.Organize = sc.getOrganize(this.sOrganize);
        }

        public ActionResult getAppConfig()
        {
            gModels.Cart cart = null;
            if (Session["Cart"] != null)
            {

                cart = (gModels.Cart)Session["Cart"];
            }
            else
            {
                cart = new Cart();

            }
            return Json(new { success = true, ShoppingCart = cart, config = sc.getOneObject("config", Organize.ID), menus = sc.ListObjectWithChild("menu", Organize.ID, " order by o.gOrder asc ", " order by o.gOrder asc "), ProvinceList = sc.GetListProvince() }, JsonRequestBehavior.AllowGet);

        }

        public ActionResult ListObject(int page = 1, int pagesize = 10)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Json(new { success = false, auth = false, msg = "Bạn chưa đăng nhập hoặc không quyền hạn này." }, JsonRequestBehavior.AllowGet);
            }
            var listobjects = sc.Listing(page, pagesize, Organize.ID);
            return Json(new { success = true, Data = listobjects, Username = User.Identity.Name }, JsonRequestBehavior.AllowGet);
        }

        //use with paing
        public ActionResult GetListObjectData(string objectname, string filters, string orderbys, int cpage = 1, int cpageitem = 12)
        {
            var listobjects = sc.getListObject(objectname, filters, orderbys, cpage, cpageitem, Organize.ID);
            //Vu~ them get ObjectType ,GroupID
            var ObjectType = sc.getObjectType(objectname);
            return Json(new { success = true, data = listobjects, objectType = 1, GroupID = sc.getBaseObjectGroupID(objectname) }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetListObjectDataHome(string objectname, string filters, string orderbys, int cpage = 1, int cpageitem = 12)
        {
            var listobjects = sc.getListObjectHome(objectname, filters, orderbys, cpage, cpageitem, Organize.ID);
            return Json(new { success = true, data = listobjects }, JsonRequestBehavior.AllowGet);
        }
        //
        //use with paing
        public ActionResult GetListChildObjectData(string objectname, string orderbys, string parentid = "0", int cpage = 1, int cpageitem = 12)
        {
            var listobjects = sc.getListChildObject(objectname, parentid, orderbys, cpage, cpageitem, Organize.ID);
            foreach (var obj in listobjects.Items)
            {
                obj.ParentName = new List<string>();
                if (!string.IsNullOrEmpty(obj.ParentID))
                {
                    if (obj.ParentID.Contains(','))
                        foreach (var item in obj.ParentID.Split(','))
                        {
                            obj.ParentName.Add(sc.getParentNameByParentID(item));
                        }
                    else
                    {
                        obj.ParentName.Add(sc.getParentNameByParentID(obj.ParentID));
                    }
                }
            }
            return Json(new { success = true, data = listobjects, parents = sc.parentList(objectname, 0, Organize.ID) }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult editObject(string objectname, long ID)
        {
            var objbase = sc.findObject(objectname, ID, Organize.ID);
            if (objbase == null)
            {
                return Json(new { success = false, msg = "object not found." }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new
                {
                    success = true,
                    data = objbase,
                    parents = sc.parentList(objectname, 0, Organize.ID)
                }, JsonRequestBehavior.AllowGet);

            }
        }
        public ActionResult findObject(string objectname, long ID)
        {
            var objbase = sc.findObject(objectname, ID, Organize.ID);
            if (objbase == null)
            {
                return Json(new { success = false, msg = "object not found." }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { success = true, data = objbase }, JsonRequestBehavior.AllowGet);

            }
        }
        public ActionResult GetOneBaseObject(string objectname)
        {
            var objbase = sc.getOneBaseObject(objectname, Organize.ID);
            if (objbase == null)
            {
                return Json(new { success = false, msg = "object not found." }, JsonRequestBehavior.AllowGet);
            }
            else
            {

                return Json(new { success = true, data = objbase, parents = sc.parentList(objectname, 0, Organize.ID) }, JsonRequestBehavior.AllowGet);

            }
        }
        public ActionResult GetObjectListTile(string objectname)
        {
            var objbase = sc.ListObjectTitle(objectname, Organize.ID);
            return Json(new { success = true, data = objbase }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetOneObject(string objectname)
        {
            var objbase = sc.getOneObject(objectname, Organize.ID);
            if (objbase == null)
            {
                return Json(new { success = false, msg = "object not found." }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { success = true, data = objbase }, JsonRequestBehavior.AllowGet);

            }
        }
        [HttpPost]
        public ActionResult UpdateOneObject(gModels.gObject model)
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Json(new { success = false, auth = false, msg = "Bạn chưa đăng nhập hoặc không quyền hạn này." }, JsonRequestBehavior.AllowGet);
            }
            var modelImage = model.Attrs.Where(m => m.AttrType == 9);
            if (modelImage.Count() > 0)
            {
                foreach (var item in model.Attrs.Where(m => m.AttrType == 9))
                {
                    item.AttrValue = item.AttrValue.Replace("[", "").Replace("]", "").Replace('"', ' ');
                }
            }
            long id = sc.UpdateOneModel(model, Organize.ID);
            return Json(new { success = true, data = id });
        }

        public ActionResult SortObjectGroup(string order)
        {
            string[] sp1 = order.Split(new string[] { "|" }, StringSplitOptions.RemoveEmptyEntries);
            foreach (string sp in sp1)
            {
                string[] orders = sp.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
                sc.UpdateObjectGroupOrder(long.Parse(orders[0]), int.Parse(orders[1]), Organize.ID);
            }
            return Json(new { success = true }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult SortObject(string order)
        {
            string[] sp1 = order.Split(new string[] { "|" }, StringSplitOptions.RemoveEmptyEntries);
            foreach (string sp in sp1)
            {
                string[] orders = sp.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
                sc.SortObject(long.Parse(orders[0]), int.Parse(orders[1]), Organize.ID);
            }
            return Json(new { success = true }, JsonRequestBehavior.AllowGet);
        }

        //send mail
        public ActionResult SendMail(SendMail model)
        {

            var mailconfig = sc.getOneObject("mailconfig", Organize.ID);
            if (mailconfig == null)
                return Json(new { success = false, msg = "You should config mail sender first." }, JsonRequestBehavior.AllowGet);

            var config = mailconfig.Attrs.ToDictionary(m => m.AttrName, m => m.AttrValue);
            try
            {
                var template = sc.findObject("mailtemplate", model.TemplateID, Organize.ID);
                if (template == null)
                    return Json(new { success = false, msg = "Template not found" }, JsonRequestBehavior.AllowGet);

                var SmtpServer = new SmtpClient(config["host"]);
                SmtpServer.Port = int.Parse(config["port"]);
                SmtpServer.Credentials = new System.Net.NetworkCredential(config["user"], config["password"]);
                SmtpServer.EnableSsl = true;



                List<Receiver> listerror = new List<Receiver>();
                List<gModels.gObjectAttr> listAttr = new List<gObjectAttr>();
                string recevers = "";
                foreach (var receiver in model.Receivers)
                {
                    try
                    {
                        var email = new GuMail();
                        email.mSmtp = SmtpServer;
                        email.From = config["user"];
                        //get email template
                        var templateconfig = template.Attrs.ToDictionary(m => m.AttrName, m => m.AttrValue);
                        email.Title = template.Title;
                        email.ContentText = templateconfig["shortdescription"];
                        email.ContentHtml = templateconfig["mailcontent"];
                        email.To = receiver.text;
                        email.Send();
                        if (recevers != "") recevers += "," + receiver.text;
                        else recevers += receiver.text;


                    }
                    catch
                    {
                        listerror.Add(receiver);
                    }
                }
                listAttr.Add(new gModels.gObjectAttr() { ID = 9, AttrValue = recevers, gObjectGroupID = 3, Status = 1, CreateDate = DateTime.Now, AttrType = 17 });
                listAttr.Add(new gModels.gObjectAttr() { ID = 11, AttrValue = JsonConvert.SerializeObject(template), gObjectGroupID = 3, Status = 1, CreateDate = DateTime.Now, AttrType = 4 });
                //hh
                sc.UpdateOneModel(new gObject()
                {
                    Title = template.Title,
                    CreateDate = DateTime.Now,
                    Status = 1,
                    gGroupID = 3,
                    Slug = template.Slug,
                    Attrs = listAttr
                }, Organize.ID);
                return Json(new { success = true, error = listerror }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, mgs = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        //get object home
        public ActionResult GetPanelObjects(string objects)
        {
            string[] spobjects = objects.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
            List<gModels.gPanelObject> List = new List<gPanelObject>();

            foreach (var objname in spobjects)
            {
                gModels.gPanelObject panel = new gPanelObject();
                panel.Categorys = sc.ListObjectWithCondition(objname, "isnull(ParentID,0)=0 and isnull(gShowHome,0)=1  and isnull(gEnabled,0)=1 ", 0, Organize.ID);
                panel.gObjectName = objname;
                if (panel.Categorys.Count > 0)
                {
                    panel.gObjectDisplayName = panel.Categorys[0].gObjectDisplayName;
                }
                else
                {
                    panel.gObjectDisplayName = objname;
                }

                panel.ListBestBuy = sc.ListObjectWithCondition(objname, "isnull(ParentID,0)<>0 and gBestBuy=1 and isnull(gEnabled,0)=1", 0, Organize.ID);
                panel.ListShowHome = sc.ListObjectWithCondition(objname, "isnull(ParentID,0)<>0 and gShowHome=1 and isnull(gEnabled,0)=1", 0, Organize.ID);
                List.Add(panel);
            }
            return Json(new { success = true, data = List }, JsonRequestBehavior.AllowGet);
        }
        //
        public ActionResult GetObjectContent(long ID = 0, int iRelative = 5, int cpage = 1, int cpageitem = 12)
        {
            var obj = sc.GetObjectContent(ID, iRelative, cpage, cpageitem);
            if (obj == null)

                return Json(new { success = false, msg = "Object not found" }, JsonRequestBehavior.AllowGet);
            else
                return Json(new { success = true, data = obj }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult GetViewObject(string objectname, int childget = 12)
        {
            gModels.gPanelObject panel = new gPanelObject();
            panel.Categorys = sc.parentListHome(objectname, 0, Organize.ID);
            panel.gObjectName = objectname;
            if (panel.Categorys.Count > 0)
            {
                panel.gObjectDisplayName = panel.Categorys[0].gObjectDisplayName;
            }
            else
            {
                panel.gObjectDisplayName = objectname;
            }
            foreach (var cat in panel.Categorys)
            {
                cat.Childrens = sc.ListObjectWithCondition(objectname, "ParentID=" + cat.ID + " and isnull(gEnabled,0)=1 ", childget, Organize.ID);
            }

            panel.ListBestBuy = sc.ListObjectWithCondition(objectname, "ParentID is not null and gBestBuy=1 and isnull(gEnabled,0)=1 ", 0, Organize.ID);

            return Json(new { success = true, data = panel }, JsonRequestBehavior.AllowGet);
        }
        //get object for links
        public ActionResult GetLinkPanelObjectsHome(string objects, string childorderby, string parentorderby)
        {
            string[] spobjects = objects.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
            List<gModels.gPanelObject> List = new List<gPanelObject>();
            foreach (var objname in spobjects)
            {
                gModels.gPanelObject panel = new gPanelObject();
                panel.Categorys = sc.ListObjectWithChildHome(objname, Organize.ID, childorderby, parentorderby);
                panel.gObjectName = objname;
                if (panel.Categorys.Count > 0)
                {
                    panel.gObjectDisplayName = panel.Categorys[0].gObjectDisplayName;
                }
                else
                {
                    panel.gObjectDisplayName = objname;
                }

                List.Add(panel);
            }
            return Json(new { success = true, data = List }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetLinkPanelObjects(string objects, string childorderby, string parentorderby)
        {
            string[] spobjects = objects.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);
            List<gModels.gPanelObject> List = new List<gPanelObject>();
            foreach (var objname in spobjects)
            {
                gModels.gPanelObject panel = new gPanelObject();
                panel.Categorys = sc.ListObjectWithChild(objname, Organize.ID, childorderby, parentorderby);
                panel.gObjectName = objname;
                if (panel.Categorys.Count > 0)
                {
                    panel.gObjectDisplayName = panel.Categorys[0].gObjectDisplayName;
                }
                else
                {
                    panel.gObjectDisplayName = objname;
                }

                List.Add(panel);
            }
            return Json(new { success = true, data = List }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult DeleteObjects(string IDs)
        {
            sc.UpdateDeleteObjects(IDs);
            return Json(new { success = true }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult AddCart(long ID = 0)
        {
            var obj = sc.findObjectByID(ID);
            gModels.Cart cart;
            if (Session["Cart"] == null)
            {
                cart = new Cart();
            }
            else
            {
                cart = (gModels.Cart)Session["Cart"];
            }
            var cartitem = cart.find(obj.ID);
            if (cartitem == null)
            {
                cart.AddUpdateCart(new gModels.CartItem() { Quantity = 1, Object = obj, ID = obj.ID });
                Session["Cart"] = cart;
                return Json(new { success = true, count = cart.Count }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                Session["Cart"] = cart;
                return Json(new { success = false, msg = "Đã thêm trong giỏ hàng!", count = cart.Count }, JsonRequestBehavior.AllowGet);
            }


        }
        public ActionResult GetCart()
        {
            gModels.Cart cart = null;
            if (Session["Cart"] != null)
            {

                cart = (gModels.Cart)Session["Cart"];
            }
            else
            {
                cart = new Cart();

            }
            return Json(new { success = true, data = cart }, JsonRequestBehavior.AllowGet);

        }

        ///////////////////////////////Vũ code dưới dòng comment này...
        /// <summary>
        /// Author :Hoang Vu
        /// </summary>
        /// <param name="ID">ProvinceID</param>
        /// <returns></returns>
        public JsonResult GetListDistrict(int ID)
        {
            return Json(new { data = sc.GetDistrictList(ID), msg = "Danh sach quan huyen" }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ListMenuCategory(int page=1,int pagesize=10)
        {
            return Json(new { data = sc.ListMenuCategory(page,pagesize), msg = "List Menu Category" }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetDetailMenu(long MenuCatID,int page=1,int pagesize=10)
        {
            return Json(new { data = sc.GetDetailMenu(MenuCatID,page, pagesize), msg = "List Menu Detail" }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult AddMenuItem(MenuDetails menu, string SubItemsJSON)
        {
            try {
                    menu.SubItems = SubItemsJSON;
                    sc.AddMenuItem(menu);
                    return Json(new { success = true, msg = "Thêm menu thành công" }, JsonRequestBehavior.AllowGet);
             }
            catch
            {
                return Json(new { success = false, msg = "Đã có lỗi xảy ra" }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult UpdateItem(MenuDetails menu, string SubItemsJSON)
        {
            try
            {
                menu.SubItems = SubItemsJSON;
                sc.UpdateMenuItem(menu);
                return Json(new { success = true, msg = "Cập nhật menu thành công" }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false, msg = "Đã có lỗi xảy ra" }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult DeleteMenuItem(MenuDetails menu)
        {
            try
            {
                sc.DeleteMenuItem(menu);
                return Json(new { success = true, msg = "Xóa menu thành công" }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false, msg = "Đã có lỗi xảy ra" }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult AddMenuCategory(MenuCategory menugroup)
        {
            try
            {
                sc.AddMenuCategory(menugroup);
                return Json(new { success = true, msg = "Xóa menu thành công" }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false, msg = "Đã có lỗi xảy ra" }, JsonRequestBehavior.AllowGet);
            }
        }
        #region Booking
        public JsonResult ListTableBook(int page=1,int pagesize=10)
        {
            return Json(new { data = sc.ListTableBooking(page, pagesize), msg = "List Table Booking" }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ListBoatBook(int page = 1, int pagesize = 10)
        {
            return Json(new { data = sc.ListBoatBooking(page, pagesize), msg = "List Boat Booking" }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult ListEventBook(int page = 1, int pagesize = 10)
        {
            return Json(new { data = sc.ListEventBooking(page, pagesize), msg = "List Event Booking" }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult TableBooking(TableBooking table)
        {
            try
            {
                sc.TableBooking(table);
                return Json(new { success = true, msg = "Book thành công" }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false, msg = "Đã có lỗi xảy ra" }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult BoatBooking(BoatBooking boat)
        {
            try
            {
                sc.BoatBooking(boat);
                return Json(new { success = true, msg = "Book thành công" }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false, msg = "Đã có lỗi xảy ra" }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult EventBooking(EventBooking ev)
        {
            try
            {
                sc.EventBooking(ev);
                return Json(new { success = true, msg = "Book thành công" }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false, msg = "Đã có lỗi xảy ra" }, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion
    }
}
