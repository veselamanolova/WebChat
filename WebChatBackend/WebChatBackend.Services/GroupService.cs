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
    public class GroupService: IGroupService
    {
        private readonly WebChatContext _context;

        public GroupService(WebChatContext context)
        {
            _context = context;
        }

        public async Task<List<Message>> GetAllGlobalGroupMessagesAsync() =>
            await _context.Mesages
            .Where(m => m.GroupId == null)
            .ToListAsync();

        public async Task SaveGlobalGroupMessageAsync(int userId, string text, DateTime date)
        {
            await _context.Mesages.AddAsync(new Message()
            {
                GroupId = null,
                UserId = userId, 
                Text = text, 
                Date = date
            });
            await _context.SaveChangesAsync();
        }
    }
}
