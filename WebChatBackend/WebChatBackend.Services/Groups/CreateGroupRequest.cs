using System.Collections.Generic;
using WebChatBackend.Services.Groups;

namespace WebChatBackend.Services.Groups
{
    public class CreateGroupRequest
    {
        public string Name { get; set; }
        public List<string> UserIds { get; set; } = new List<string>(); 
    }
}