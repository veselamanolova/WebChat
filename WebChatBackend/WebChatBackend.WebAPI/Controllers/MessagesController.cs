using System.Collections.Generic;
using System.Threading.Tasks;
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
        public async Task<ActionResult<List<Message>>> Get(int groupId)
        {
            int currentUserId = 1; //Context.User.Claims["..."]
            List<Message> groupMessages = await _messageService.GetGroupMessagesAsync(groupId, currentUserId); 
            return groupMessages;
        }
    }
}
