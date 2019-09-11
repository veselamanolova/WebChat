using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace WebChatBackend.Data.Models
{
    public class User: IdentityUser
    {        
       // public int Id { get; set; }
      //  [Required, MinLength(2), MaxLength(40)]
      //  public string Name { get; set; }
      //  public string Password { get; set; }
        public List<UserGroup> UserGroups { get; set; }
    }
}
