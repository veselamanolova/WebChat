using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebChatBackend.Data.Models;
using WebChatBackend.Services;
using WebChatBackend.Services.Contracts;
using WebChatBackend.Services.Groups;

namespace WebChatBackend.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class GroupsController : ControllerBase
    {
        private readonly IGroupService _groupService;

        public GroupsController(IGroupService groupService)
        {
            _groupService = groupService;
        }
        
        // GET api/Groups/5
        [HttpGet]        
        public async Task<ActionResult<List<GroupWithUsers>>> Get()
        {
            
            string currentUserId = HttpContext.User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Sub)?.Value;
            List<GroupWithUsers> userGroups = await _groupService.GetUserGroupsAsync(currentUserId);
            return userGroups;
        }


        [HttpPost]
        public async Task<ActionResult<GroupWithUsers>> Post(CreateGroupRequest createGroupRequest)
        {
            string currentUserId = HttpContext.User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Sub)?.Value;
            createGroupRequest.UserIds.Add(currentUserId); 

            GroupWithUsers newGroup = await _groupService.CreateNewGroupAsync(createGroupRequest);
            return newGroup;
        }  


    }
}
