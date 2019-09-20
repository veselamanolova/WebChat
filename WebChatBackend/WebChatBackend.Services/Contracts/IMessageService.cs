using System.Collections.Generic;
using System.Threading.Tasks;
using WebChatBackend.Data.Models;

namespace WebChatBackend.Services.Contracts
{
    public interface IMessageService
    {
        Task<List<MessageWithUserData>> GetAllGlobalGroupMessagesAsync();

        Task<List<MessageWithUserData>> GetGroupMessagesAsync(int groupId, string currentUserId);

        Task<MessageWithUserData> SaveGlobalGroupMessageAsync(string userId, string text);

        Task<MessageWithUserData> SaveGlobalGroupMessageAsync(string userId, string text, int groupId);
    }
}
