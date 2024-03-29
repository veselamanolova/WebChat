﻿using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.UserManagement;

namespace WebChatBackend.Services.Groups
{
    public class GroupWithUsers
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsPrivateChat { get; set; }
        public DateTime LastActivityDate { get; set; } 
        public List<BasicUserInfo> UsersInfo { get; set; }
        public int UnreadMessagesCount { get; set; }
      
     

        public GroupWithUsers(Group group, string currentUserId = null, string groupNameSeparator = null, int unreadMessagesCount = 0)
        {
            Id = group.Id;
            Name = string.IsNullOrEmpty(group.Name) ?
                group.GetAutoGroupName(currentUserId, groupNameSeparator) : group.Name;
            IsPrivateChat = group.IsPrivateChat;
            LastActivityDate = group.LastActivityDate;
            UsersInfo = group.GetUsers().Select(u => new BasicUserInfo(u)).ToList();
            UnreadMessagesCount = unreadMessagesCount; 
        }
    }
}
