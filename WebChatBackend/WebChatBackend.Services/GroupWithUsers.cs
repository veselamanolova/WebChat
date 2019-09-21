using System;
using System.Collections.Generic;
using System.Linq;
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

        public GroupWithUsers() { }        

        public GroupWithUsers(Group group, string currentUserId = null, string groupNameSeparator = null)
        {
            Id = group.Id;
            Name = string.IsNullOrEmpty(group.Name) ?
                group.GetAutoGroupName(currentUserId, groupNameSeparator) : group.Name;
            IsPrivateChat = group.IsPrivateChat;
            UsersInfo = group.GetUsers().Select(u => new BasicUserInfo(u)).ToList();
        }
    }
}
