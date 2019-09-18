using System;
using System.Collections.Generic;
using System.Text;

namespace WebChatBackend.Services.UserManagement
{
    public class LoginResponse
    {
        public string UserId { get; set; }
        public string UserName { get; set;  }
        public string Token { get; set; }
    }
}
