using System.Collections.Generic;
using System.Threading.Tasks;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.Messages;

namespace WebChatBackend.Services.Contracts
{
    public interface IMessageService
    {
        Task<List<MessageWithUserData>> GetAllGlobalGroupMessagesAsync(string searchText, int? skip, int? take);

        Task<List<MessageWithUserData>> GetGroupMessagesAsync(int groupId, string currentUserId, string searchText, int? skip, int? take);

        Task<MessageWithUserData> SaveGlobalGroupMessageAsync(string userId, string text);

        Task<MessageWithUserData> SaveGroupMessageAsync(string userId, string text, int groupId);
    }
}
