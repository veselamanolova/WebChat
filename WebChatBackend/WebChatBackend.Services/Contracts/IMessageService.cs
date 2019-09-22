using System.Collections.Generic;
using System.Threading.Tasks;
using WebChatBackend.Data.Models;

namespace WebChatBackend.Services.Contracts
{
    public interface IMessageService
    {
        Task<List<MessageWithUserData>> GetAllGlobalGroupMessagesAsync(string searchText);

        Task<List<MessageWithUserData>> GetGroupMessagesAsync(int groupId, string currentUserId, string searchText);

        Task<MessageWithUserData> SaveGlobalGroupMessageAsync(string userId, string text);

        Task<MessageWithUserData> SaveGroupMessageAsync(string userId, string text, int groupId);
    }
}
