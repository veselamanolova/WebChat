using System;
using System.Collections.Generic;
using System.Text;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.UserManagement;

namespace WebChatBackend.Services
{
    public class GroupWithUsers
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsPrivateChat { get; set; }
        public List<BasicUserInfo> UsersInfo { get; set; }       
    }
}
