using System;
using System.Collections.Generic;
using System.Text;
using WebChatBackend.Data.Models;

namespace WebChatBackend.Services.UserManagement
{
    public class BasicUserInfo
    {
        public string Id { get; set; }
        public string UserName { get; set; }

        public BasicUserInfo()
        {

        }

        public BasicUserInfo(User u)
        {
            Id = u.Id;
            UserName = u.UserName;
        }
    }
}
