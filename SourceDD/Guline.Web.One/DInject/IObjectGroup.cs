using System;
using Guline.Web.One.gModels;
using System.Collections.Generic;
using PetaPoco;
namespace Guline.Web.One.DInject
{
    public interface IObjectGroup
    {
        PetaPoco.Page<gObjectGroup> Listing(int page, int pagesize,long organizeid);

        gModels.gOrganize getOrganize(string domain);

        //gModels.gObject getBaseObject(string objectname);
        gModels.gObject getOneBaseObject(string objectname, long organizeid);
        gModels.gObject getOneObject(string objectname, long organizeid);
        gModels.gObject findObject(string objectname, long ID, long organizeid);
        PetaPoco.Page<gModels.gObject> getListObject(string objectname, string filters, string orderbys, int page, int pagesize, long organizeid);

        PetaPoco.Page<gModels.gObject> getListObjectHome(string objectname, string filters, string orderbys, int page, int pagesize, long organizeid);

        PetaPoco.Page<gModels.gObject> getListChildObject(string oBbjectname, string parentid, string orderbys, int page, int pagesize, long organizeid);
        List<gModels.gObject> parentList(string objectname, long ID, long organizeid);
        List<gModels.gObject> parentListHome(string objectname, long ID, long organizeid);
     
        List<gModels.gObject> ListObjectTitle(string objectname, long organizeid);
        long UpdateOneModel(gModels.gObject model, long organizeid);

        List<gModels.gObject> ListObjectWithChild(string objectname, long organizeid, string childorderby,string parentorderby);

        List<gModels.gObject> ListObjectWithChildHome(string objectname, long organizeid, string childorderby, string parentorderby);

        void UpdateObjectGroupOrder(long ID, int order, long organizeid);
        void SortObject(long ID, int order, long organizeid);

        ///new
        List<gModels.gObject> ListObjectWithCondition(string objectname, string cond,int take, long organizeid);

        gModels.gObject GetObjectContent(long ID, int iRelative, int cpage, int cpageitem);

        void UpdateDeleteObjects(string IDs);

        gModels.gObject findObjectByID(long ID);
        ///////////////////////////////////////////////////////////////////// Vu Code
        /// <summary>
        /// Author :Hoang Vu
        /// </summary>
        /// <param name="objectname"></param>
        /// <returns></returns>
        int getObjectType(string objectname);
        long getBaseObjectGroupID(string objectname);

        string getParentNameByParentID(string p);

        List<ProvinceModel> GetListProvince();

        List<string> GetDistrictList(int ProvinceID);

        Page<MenuCategory> ListMenuCategory(int page, int pagesize);

        Page<MenuDetails> GetDetailMenu(long MenuCatID,int page, int pagesize);

        void AddMenuItem(MenuDetails menu);

        void UpdateMenuItem(MenuDetails menu);

        void DeleteMenuItem(MenuDetails menu);

        void AddMenuCategory(MenuCategory menugroup);
        void DeleteMenuCategory(MenuCategory menugroup);
        Page<TableBooking> ListTableBooking(int page, int pagesize);
        Page<BoatBooking> ListBoatBooking(int page, int pagesize);
        Page<EventBooking> ListEventBooking(int page, int pagesize);
        void TableBooking(TableBooking table);
        void BoatBooking(BoatBooking table);
        void EventBooking(EventBooking table);
        Page<MartiniClub> ListMartini(int page, int pagesize);
        Page<Contact> ListContact(int page, int pagesize);
        void AddContact(Contact contact);
        void AddMartini(MartiniClub martini);


        string SaveCV(System.Web.HttpPostedFileBase cvfile);

        string SaveImage(System.Web.HttpPostedFileBase photo);

        void SubmitCareer(Career carrer);
    }
}
