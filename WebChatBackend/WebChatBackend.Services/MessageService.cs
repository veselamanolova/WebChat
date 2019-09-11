using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebChatBackend.Data;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.Contracts;

namespace WebChatBackend.Services
{
    public class MessageService : IMessageService
    {
        private readonly WebChatContext _context;

        public MessageService(WebChatContext context)
        {
            _context = context;
        }

        public async Task<List<Message>> GetAllGlobalGroupMessagesAsync() =>
            await _context.Mesages
            .Where(m => m.GroupId == null)
            .ToListAsync();

        public async Task<List<Message>> GetGroupMessagesAsync(int groupId, string currentUserId)
        {
            await VerifyUserBelongsToGroupAsync(currentUserId, groupId);

            return await _context.Mesages
             .Where(m => m.GroupId == groupId)
             .ToListAsync();
        }      

        public async Task<Message> SaveGlobalGroupMessageAsync(string userId, string text)
        {
            var message = new Message()
            {
                GroupId = null,
                UserId = userId,
                Text = text,
                Date = DateTime.UtcNow
            };
            await _context.Mesages.AddAsync(message);
            await _context.SaveChangesAsync();
            return message;
        }

        public async Task<Message> SaveGlobalGroupMessageAsync(string userId, string text, int groupId)
        {
            await VerifyUserBelongsToGroupAsync(userId, groupId);
            var message = new Message()
            {
                GroupId = groupId,
                UserId = userId,
                Text = text,
                Date = DateTime.UtcNow
            };
            await _context.Mesages.AddAsync(message);
            await _context.SaveChangesAsync();
            return message;
        }

        private async Task VerifyUserBelongsToGroupAsync(string userId, int groupId)
        {
            bool result = await _context.UserGroup.AnyAsync(ug => ug.UserId == userId && ug.GroupId == groupId);
            if (!result)
            {
                throw new GroupAccessException();
            }
        }
    }
}
