using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebChatBackend.Data;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.Contracts;

namespace WebChatBackend.Services.Groups
{
    public class GroupService : IGroupService
    {
        private readonly WebChatContext _context;

        public GroupService(WebChatContext context)
        {
            _context = context;
        }

        public async Task<GroupWithUsers> CreateNewGroupAsync(CreateGroupRequest createGroupRequest, string currentUserId)
        {
            int groupUsersNumber = createGroupRequest.UserIds.Count;

            //TODO if userCount ==1

            if (groupUsersNumber == 2)
            {
                //check if this private chat already exists 

                Group sameGroup = await _context.Groups
                    .Include(g => g.UserGroups)
                    .ThenInclude(ug => ug.User)
                    .SingleOrDefaultAsync(g => g.IsPrivateChat
                            && g.UserGroups.Count == 2
                            && g.UserGroups.Any(ug => ug.UserId == createGroupRequest.UserIds[0])
                            && g.UserGroups.Any(ug => ug.UserId == createGroupRequest.UserIds[1])
                    );
                return new GroupWithUsers(sameGroup, currentUserId, " ");
            }


            var newGroup = await _context.Groups.AddAsync(new Group
            {

                Name = createGroupRequest.Name,
                IsPrivateChat = createGroupRequest.UserIds.Count == 2,
                UserGroups = createGroupRequest.UserIds.Select(userID => new UserGroup()
                {
                    UserId = userID,
                    
                }).ToList()
            });

            await _context.SaveChangesAsync();
            var insertedGroup = _context.Groups
                .Include(x => x.UserGroups).ThenInclude(ug => ug.User)
                .First(x => x.Id == newGroup.Entity.Id);
            //await newGroup.Collection(x => x.UserGroups).
            return new GroupWithUsers(insertedGroup, currentUserId, " ");
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
