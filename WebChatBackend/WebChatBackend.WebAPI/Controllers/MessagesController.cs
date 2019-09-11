using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.Contracts;

namespace WebChatBackend.WebAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageService _messageService;

        public MessagesController(IMessageService messageService)
        {
            _messageService = messageService;
        }

        // GET api/messages
        [HttpGet]
        public async Task<ActionResult<List<Message>>> Get()
        {
            List<Message> publicMessages = await _messageService.GetAllGlobalGroupMessagesAsync();
            return publicMessages;
        }

        // GET api/Groups/5

        [HttpGet("{groupId}")]
        [Authorize]
        public async Task<ActionResult<List<Message>>> Get(int groupId)
        {
            string currentUserId = HttpContext.User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Sub)?.Value; //"f5133dd5-fa37-4ba0-b8ef-b8fcaacec8d3"
            List<Message> groupMessages = await _messageService.GetGroupMessagesAsync(groupId, currentUserId); 
            return groupMessages;
        }
    }
}
