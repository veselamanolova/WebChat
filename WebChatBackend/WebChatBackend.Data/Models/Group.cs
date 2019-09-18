using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace WebChatBackend.Data.Models
{
    public class Group
    {
        public int Id { get; set; }
        [Required, MinLength(2), MaxLength(40)]
        public string Name { get; set; }
        public bool IsPrivateChat { get; set; }
        public List<UserGroup> UserGroups { get; set; }
        public List<Message> Messages { get; set; }
    }
}
