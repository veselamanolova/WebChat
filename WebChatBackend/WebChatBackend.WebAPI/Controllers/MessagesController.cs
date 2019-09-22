using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.Contracts;
using WebChatBackend.Services;

namespace WebChatBackend.WebAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class MessagesController : ControllerBase
    {
        private readonly IMessageService _messageService;

        public MessagesController(IMessageService messageService)
        {
            _messageService = messageService;
        }

        // GET api/messages?search=...
        [HttpGet]
        public async Task<ActionResult<List<MessageWithUserData>>> Get(string search)
        {
            List<MessageWithUserData> publicMessages = await _messageService.GetAllGlobalGroupMessagesAsync(search);
            return publicMessages;
        }

        // GET api/messages/5?search=...
        [HttpGet("{groupId}")]
        public async Task<ActionResult<List<MessageWithUserData>>> Get(int groupId, string search)
        {
            string currentUserId = HttpContext.User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Sub)?.Value; //"f5133dd5-fa37-4ba0-b8ef-b8fcaacec8d3"
            List<MessageWithUserData> groupMessages = await _messageService.GetGroupMessagesAsync(groupId, currentUserId, search); 
            return groupMessages;
        }
    }
}
