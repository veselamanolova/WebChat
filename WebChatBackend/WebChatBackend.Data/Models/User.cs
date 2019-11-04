using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace WebChatBackend.Data.Models
{
    public class User : IdentityUser
    {
        public List<UserGroup> UserGroups { get; set; }
        public string ProfilePicturePath { get; set; }

    }
}
    
