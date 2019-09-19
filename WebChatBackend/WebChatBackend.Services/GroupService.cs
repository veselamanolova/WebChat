using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebChatBackend.Data;
using WebChatBackend.Services.Contracts;

namespace WebChatBackend.Services
{
    public class GroupService : IGroupService
    {
        private readonly WebChatContext _context;

        public GroupService(WebChatContext context)
        {
            _context = context;
        }

        public async Task<List<GroupWithUsers>> GetUserGroupsAsync(string userId)
        {
            var result = await _context.Groups
                .Include(g => g.UserGroups)
                .ThenInclude(ug => ug.User)
                .Where(g => g.UserGroups.Exists(ug => ug.UserId == userId))
                .Select(g => new GroupWithUsers(g, userId, " "))
                .ToListAsync();
            return result;
        }
    }
}
