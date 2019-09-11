using System;
using System.Collections.Generic;
using System.Text;
using WebChatBackend.Data.Models;

namespace WebChatBackend.Services.Contracts
{
    public interface IJwtGenerator
    {
        string CreateToken(User user, string securityKey); 
    }
}
