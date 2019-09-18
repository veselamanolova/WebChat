using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebChatBackend.Data;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.Contracts;
using WebChatBackend.Services.UserManagement;

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
            List<int> userGroupIds = await _context.UserGroup
            .Where(ug => ug.UserId == userId)
            .Select(ug => ug.GroupId)
            .ToListAsync();

            var groups = await _context.Groups
                .Where(g => userGroupIds.Contains(g.Id))
                .Include(g => g.UserGroups)
                .Select((g) => new GroupWithUsers
                {
                    Id = g.Id,
                    IsPrivateChat = g.IsPrivateChat,
                    UsersInfo = _context.Users.
                    Where(u => u.UserGroups.Select(ug => ug.GroupId).Contains(g.Id))
                    .Select(u => GenerataGroupWithUser(u))
                    .ToList(),
                     Name = g.Name
                }).ToListAsync();

            foreach (var group in groups)
            {
                if (string.IsNullOrEmpty(group.Name))
                {
                    group.Name =  CreateAutoGroupName(group, userId);
                }
            }
            return groups;
        }

        private static BasicUserInfo GenerataGroupWithUser(User u)
        {
            var result = new BasicUserInfo
            {
                Id = u.Id,
                UserName = u.UserName
            };
            return result;
        }

        private string CreateAutoGroupName(GroupWithUsers group, string userId)
        {
            return String.Join(" ", group.UsersInfo.Where(g => g.Id != userId).Select(g => g.UserName).ToArray());
        }
    }
}
