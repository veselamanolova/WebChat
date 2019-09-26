using System;
using System.Collections.Generic;
using System.Linq;

namespace WebChatBackend.Data.Models
{
    public class Group
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool IsPrivateChat { get; set; }
        public DateTime LastActivityDate { get; set; }

        public List<UserGroup> UserGroups { get; set; }
        public List<Message> Messages { get; set; }
      
        public IEnumerable<User> GetUsers()
        {
            return this?.UserGroups.Select(ug => ug.User) ?? new User[] { };
        }
        
        public string GetAutoGroupName(string currentUserId, string separator)
        {
            return string.Join(separator, this.GetUsers()
                .Where(u => u.Id != currentUserId)
                .Select(u => u.UserName).ToArray()
            );
        }
    }
}
