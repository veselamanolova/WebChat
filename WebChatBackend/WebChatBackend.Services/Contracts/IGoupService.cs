using System.Collections.Generic;
using System.Threading.Tasks;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.Groups; 

namespace WebChatBackend.Services.Contracts
{
    public interface IGroupService
    {
        Task<List<GroupWithUsers>> GetUserGroupsAsync(string userId);
        Task<GroupWithUsers> CreateNewGroupAsync(CreateGroupRequest createGroupRequest);
    }
}
