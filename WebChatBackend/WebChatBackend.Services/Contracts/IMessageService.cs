using System.Collections.Generic;
using System.Threading.Tasks;
using WebChatBackend.Data.Models;

namespace WebChatBackend.Services.Contracts
{
    public interface IMessageService
    {
        Task<List<Message>> GetAllGlobalGroupMessagesAsync();

        Task<List<Message>> GetGroupMessagesAsync(int groupId, string currentUserId);

        Task<Message> SaveGlobalGroupMessageAsync(string userId, string text);

        Task<Message> SaveGlobalGroupMessageAsync(string userId, string text, int groupId);
    }
}
