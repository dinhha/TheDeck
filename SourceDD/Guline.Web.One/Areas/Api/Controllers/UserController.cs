using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using Guline.Web.One.Controllers;
using Guline.Web.One.DInject;
using Guline.Web.One.gModels;

namespace Guline.Web.One.Areas.Api.Controllers
{
    public class UserController : GulineController
    {
        private readonly IUserService _userService;
        public UserController(IUserService userservice)
        {
            _userService = userservice;
        }
        [HttpPost]
        public ActionResult Login(string username, string password, bool remember = false)
        {
            var userLogin = _userService.VaildationLogin(username, password);
            if (userLogin != null)
            {
                FormsAuthentication.SetAuthCookie(username, remember);

                return Json(new { success = true, data = new { userLogin.Email, userLogin.GroupID, userLogin.GroupName,userLogin.FullName } }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { success = false, msg = "Wrong username or password.", errorcode = 1 }, JsonRequestBehavior.AllowGet);
            }
        }
       
        public ActionResult Party(string token)
        {
            try
            {
                string refurl = Request.UrlReferrer.Host;
                var organize = _userService.findOrganize(refurl);

                string maintxt = gModels.SSTCryptographer.Decrypt(token,organize.TokenKey);
               
                if (maintxt!="OK")
                {
                    return Json(new { success = false, msg = "Access denied.references:"+refurl }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                   
                    if (organize == null)
                    {
                        return Json(new { success = false, msg = "Access denied, You should register services with guline.com - Guline Solutions." }, JsonRequestBehavior.AllowGet);
                    }
                    Session["Organize"] = organize;
                    return RedirectToAction("Index", "Admin", new { area = System.Configuration.ConfigurationManager.AppSettings["AdminUrlStart"] });
                }

            }
            catch
            {
                return Json(new { success = false, msg = "Access denied, You should register services with guline.com - Guline Solutions." }, JsonRequestBehavior.AllowGet);
            }
            
        }
   
        public ActionResult Logout()
        {
            System.Web.Security.FormsAuthentication.SignOut();
            return Json(new { success = true }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Register(gModels.User model)
        {
            try
                {

                    var us=_userService.CreateAccount(model);

                    FormsAuthentication.SetAuthCookie(us.Email, false);

                    return Json(new { success = true, data = new { us.Email, us.GroupID} });
                }
                catch (MembershipCreateUserException e)
                {
                    return Json(new { success = false,msg=e.ToString() });
                }
           
        }
        /// <summary>
        /// List user Manager 
        /// Accept Admin only
        /// </summary>
        public JsonResult UserManager(long UserID, gModels.UserFillter fillter, int Page = 1, int Pagezise = 10)
        {
            ResultData<dynamic> kq = new ResultData<dynamic>();
            if (UserID != 0)
            {
                kq.Data = new
                {
                    Filter = fillter,
                    List = _userService.GetListUserByUser(UserID, Page, Pagezise, fillter)
                };
            }
            else
            {
                kq.Data = null;
            }
            return Json(kq, JsonRequestBehavior.AllowGet);

        }
        public JsonResult GetDetailUser(long UserID)
        {
            var user = _userService.GetUserDetail(UserID);
            if (user != null)
            {

                return Json(new { success = true, data = user }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { success = false, msg = "Wrong username or password.", errorcode = 1 }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult Update(User user)
        {
            if (user != null)
            {
                _userService.Update(user);
                return Json(new { success = true, data = user }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { success = false, msg = "Wrong username or password.", errorcode = 1 }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}
