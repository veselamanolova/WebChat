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

        public async Task<List<MessageWithUserData>> GetAllGlobalGroupMessagesAsync()
        {
            return await GetGroupMessagesAsync(null);
        }

        public async Task<List<MessageWithUserData>> GetGroupMessagesAsync(int groupId, string currentUserId)
        {
            await VerifyUserBelongsToGroupAsync(currentUserId, groupId);

            return await GetGroupMessagesAsync(groupId);
        }

        private async Task<List<MessageWithUserData>> GetGroupMessagesAsync(int? groupId)
        {
            return await _context.Messages
             .Where(m => m.GroupId == groupId)
             .Include(m => m.User)
            .Select(m => new MessageWithUserData(m))
            .ToListAsync();
        }

        public async Task<MessageWithUserData> SaveGlobalGroupMessageAsync(string userId, string text)
        {
            return await SaveGroupMessageAsync(userId, text, null);
        }

        private async Task<MessageWithUserData> SaveGroupMessageAsync(string userId, string text, int? groupId)
        {
            var message = new Message()
            {
                GroupId = groupId,
                UserId = userId,
                Text = text,
                Date = DateTime.UtcNow
            };
            await _context.Messages.AddAsync(message);
            await _context.SaveChangesAsync();
            return new MessageWithUserData(message);
        }

        public async Task<MessageWithUserData> SaveGroupMessageAsync(string userId, string text, int groupId)
        {
            await VerifyUserBelongsToGroupAsync(userId, groupId);
            return await SaveGroupMessageAsync(userId, text, groupId);
        }

        private async Task VerifyUserBelongsToGroupAsync(string userId, int groupId)
        {
            bool result = await _context.UserGroups.AnyAsync(ug => ug.UserId == userId && ug.GroupId == groupId);
            if (!result)
            {
                throw new GroupAccessException();
            }
        }
    }
}
