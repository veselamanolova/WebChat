using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.Contracts;
using WebChatBackend.Services;
using WebChatBackend.Services.Messages;

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
        public async Task<ActionResult<MessagesWithUserDataEnvelope>> Get(string search, int? skip, int? take)
        {
            MessagesWithUserDataEnvelope publicMessages = await _messageService.GetGlobalGroupMessagesAsync(search, skip, take);
            return publicMessages;
        }

        // GET api/messages/5?search=...
        [HttpGet("{groupId}")]
        public async Task<ActionResult<MessagesWithUserDataEnvelope>> Get(int groupId, string search, int? skip, int? take )
        {
            string currentUserId = HttpContext.User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Sub)?.Value; 
            MessagesWithUserDataEnvelope groupMessages = await _messageService.GetGroupMessagesAsync(groupId, currentUserId, search, skip, take); 
            return groupMessages;
        }
    }
}
