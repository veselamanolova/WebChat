using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;
using WebChatBackend.Services;
using WebChatBackend.Services.Contracts;
using WebChatBackend.Services.Messages;

namespace Chat.Hubs
{
    [Authorize]
    public class ChatHub: Hub
    {
        private readonly IMessageService _messageService;

        public ChatHub(IMessageService messageService)
        {
            _messageService = messageService;
        }      

        public Task JoinToGroup(int groupId)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, groupId.ToString());
        }

        public async Task SendMessageToGroup(string messageText, int groupId)
        {
            string userId = Context.User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Sub)?.Value;
            MessageWithUserData realMessage = await _messageService.SaveGroupMessageAsync(userId, messageText, groupId);
            await Clients.Group(groupId.ToString()).
                SendAsync("ReceiveGroupMessage", realMessage);        
        }   
        
        public async Task SendMessageToGlobalGroup(string messageText)
        {
            string userId = Context.User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Sub)?.Value;
            MessageWithUserData realMessage = await _messageService.SaveGlobalGroupMessageAsync(userId, messageText); 

            await Clients.All.SendAsync("ReceiveGlobalMessage", realMessage);
        }
    }
}
