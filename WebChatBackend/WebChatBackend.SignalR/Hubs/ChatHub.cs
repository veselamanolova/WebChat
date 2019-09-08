using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.Contracts;
using static Microsoft.AspNetCore.Hosting.Internal.HostingApplication;

namespace Chat.Hubs
{
    public class ChatHub: Hub
    {
        private readonly IMessageService _messageService;

        public ChatHub(IMessageService messageService)
        {
            _messageService = messageService;
        }      

        public Task JoinToGroup(string group)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, group);
        }

        public async Task SendMessageToGroup(string name, string message, string group)
        {           
            await Clients.Group(group).SendAsync("ReceiveMessage", name, message, group);
        }

        public async Task SendMessageToGlobalGroup(string messageText)
        {
            int userId = 1; // Context.User.Claims["..."]
            Message realMessage = await _messageService.SaveGlobalGroupMessageAsync(userId, messageText); 

            await Clients.All.SendAsync("ReceiveGlobalMessage", realMessage);
        }
    }
}
