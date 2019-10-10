using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebChatBackend.Data;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.Contracts;

namespace WebChatBackend.Services.UserGroups
{
    public class UserGroupService : IUserGroupService
    {
        private readonly WebChatContext _context;

        public UserGroupService(WebChatContext context)
        {
            _context = context;
        }

        public async Task UpdateLastActivityDateAsync(int groupId, string userId)
        {
            var userGroup = await _context.UserGroups.
                FirstAsync(ug => ug.GroupId == groupId && ug.UserId == userId);
            userGroup.LastActivityDate = DateTime.UtcNow;
            await _context.SaveChangesAsync();
        }       
    }
}
