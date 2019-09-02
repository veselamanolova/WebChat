using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace WebChatBackend.Data.Models
{
    public class User
    {        
        public int Id { get; set; }
        [Required, MinLength(2), MaxLength(40)]
        public string Name { get; set; }
        public string Password { get; set; }
        public List<UserGroup> UserGroups { get; set; }
    }
}
