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
    public class GroupService : IGroupService
    {
        private readonly WebChatContext _context;

        public GroupService(WebChatContext context)
        {
            _context = context;
        }

        public async Task<GroupWithUsers> CreateNewGroupAsync(CreateGroupRequest createGroupRequest)
        {
            var newGroup = await _context.Groups.AddAsync(new Group
            {
                Name = createGroupRequest.Name,
                UserGroups = createGroupRequest.UserIds.Select(userID => new UserGroup()
                {
                    UserId = userID
                }).ToList()
            });
            await _context.SaveChangesAsync();
            var insertedGroup = _context.Groups
                .Include(x => x.UserGroups).ThenInclude(ug => ug.User)
                .First(x => x.Id == newGroup.Entity.Id);
            //await newGroup.Collection(x => x.UserGroups).
            return new GroupWithUsers(insertedGroup);
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
