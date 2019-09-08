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
    public class MessageService: IMessageService
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

        public async Task<Message> SaveGlobalGroupMessageAsync(int userId, string text)
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
    }
}
