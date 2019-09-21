using System.Collections.Generic;

namespace WebChatBackend.Services
{
    public class CreateGroupRequest
    {
        public string Name { get; set; }
        public List<string> UserIds { get; set; } = new List<string>(); 
    }
}