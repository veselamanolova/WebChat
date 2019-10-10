using System.Collections.Generic;
using System.Threading.Tasks;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.Groups; 

namespace WebChatBackend.Services.Contracts
{
    public interface IUserGroupService
    {        
        Task UpdateLastActivityDateAsync(int groupId, string userId);
    }
}
