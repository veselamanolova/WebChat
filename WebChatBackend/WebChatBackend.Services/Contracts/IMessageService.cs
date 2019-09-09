using System.Collections.Generic;
using System.Threading.Tasks;
using WebChatBackend.Data.Models;

namespace WebChatBackend.Services.Contracts
{
    public interface IMessageService
    {
        Task<List<Message>> GetAllGlobalGroupMessagesAsync();

        Task<List<Message>> GetGroupMessagesAsync(int groupId, int currentUserId);

        Task<Message> SaveGlobalGroupMessageAsync(int userId, string text);

        Task<Message> SaveGlobalGroupMessageAsync(int userId, string text, int groupId);
    }
}
