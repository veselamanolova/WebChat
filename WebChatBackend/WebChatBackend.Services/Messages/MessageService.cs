using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using WebChatBackend.Data;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.Contracts;

namespace WebChatBackend.Services.Messages
{
    public class MessageService : IMessageService
    {
        private readonly WebChatContext _context;

        public MessageService(WebChatContext context)
        {
            _context = context;
        }

        public async Task<MessagesWithUserDataEnvelope> GetGlobalGroupMessagesAsync(string searchText, int? skip, int? take)
        {
            return await GetGroupMessagesAsync(null, searchText, skip, take);
        }

        public async Task<MessagesWithUserDataEnvelope> GetGroupMessagesAsync(int groupId, string currentUserId, string searchText, int? skip, int? take)
        {
            await VerifyUserBelongsToGroupAsync(currentUserId, groupId);
            return await GetGroupMessagesAsync(groupId, searchText, skip, take);
        }

        private async Task<MessagesWithUserDataEnvelope> GetGroupMessagesAsync(int? groupId, string searchText, int? skip, int? take)
        {            
            var queriable = _context.Messages
                .Where(m => m.GroupId == groupId && (string.IsNullOrEmpty(searchText) || m.Text.Contains(searchText)));

            int allCount = await queriable.CountAsync();
            
            var result=  await queriable
                .Skip(skip?? 0) 
                .Take(take?? allCount)
                .Include(m => m.User)
                .Select(m => new MessageWithUserData(m))
                .ToListAsync();

            return new MessagesWithUserDataEnvelope()
            {
                TotalMessages = allCount,
                Messages = result
            }; 
        }

        public async Task<MessageWithUserData> SaveGlobalGroupMessageAsync(string userId, string text)
        {
            return await SaveMessageAsync(userId, text, null);
        }

        private async Task<MessageWithUserData> SaveMessageAsync(string userId, string text, int? groupId)
        {
            var message = new Message()
            {
                GroupId = groupId,
                UserId = userId,
                Text = text,
                Date = DateTime.UtcNow
            };
            await _context.Messages.AddAsync(message);

            var group = await _context.Groups.FirstAsync(g => g.Id == groupId);
            group.LastActivityDate = message.Date;            
            _context.Attach(group);
            _context.Entry(group).Property("LastActivityDate").IsModified = true;           
            await _context.SaveChangesAsync();

            message = await _context.Messages.Include(x => x.User).SingleAsync(x => x.Id == message.Id);
            return new MessageWithUserData(message);
        }

        public async Task<MessageWithUserData> SaveGroupMessageAsync(string userId, string text, int groupId)
        {
            await VerifyUserBelongsToGroupAsync(userId, groupId);
            return await SaveMessageAsync(userId, text, groupId);
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
