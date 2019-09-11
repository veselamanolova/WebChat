using System.Collections.Generic;
using System.Threading.Tasks;
using WebChatBackend.Data.Models;

namespace WebChatBackend.Services.Contracts
{
    public interface IGroupService
    {
        Task<List<Group>> GetUserGroupsAsync(string userId);
    }
}
