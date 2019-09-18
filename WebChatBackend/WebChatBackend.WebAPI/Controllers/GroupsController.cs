using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using WebChatBackend.Data.Models;
using WebChatBackend.Services;
using WebChatBackend.Services.Contracts;

namespace WebChatBackend.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupsController : ControllerBase
    {
        private readonly IGroupService _groupService;

        public GroupsController(IGroupService groupService)
        {
            _groupService = groupService;
        }
        
        // GET api/Groups/5
        [HttpGet("{userId}")]        
        public async Task<ActionResult<List<GroupWithUsers>>> Get(string userId)
        {           
            List<GroupWithUsers> userGroups = await _groupService.GetUserGroupsAsync(userId);
            return userGroups;
        }
    }
}
