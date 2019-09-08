using System.Collections.Generic;
using System.Threading.Tasks;
using WebChatBackend.Data.Models;

namespace WebChatBackend.Services.Contracts
{
    public interface IMessageService
    {
        Task<List<Message>> GetAllGlobalGroupMessagesAsync();
        Task<Message> SaveGlobalGroupMessageAsync(int userId, string text);
    }
}
