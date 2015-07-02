using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Guline.Web.One.gModels;
using PetaPoco;

namespace Guline.Web.One.DInject
{
    public interface IUserService
    {
        User findByEmailPassword(string email, string password);
        User GetUserDetail(long UserID);
        gOrganize findOrganize(string name);

        User CreateAccount(User model);
        User VaildationLogin(string loginName, string password);

        Page<User> GetListUserByUser(long UserID, int Page, int Pagezise, UserFillter fillter);

        void Update(User user);
    }
}
