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

        public Task JoinToGroup(int groupId)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, groupId.ToString());
        }

        public async Task SendMessageToGroup(string messageText, int groupId)
        {
            int userId = 1; //Context.User.Claims["..."]
            Message realMessage = await _messageService.SaveGlobalGroupMessageAsync(userId, messageText, groupId);
            await Clients.Group(groupId.ToString()).
                SendAsync("ReceiveGroupMessage", realMessage);        
        }   
        
        public async Task SendMessageToGlobalGroup(string messageText)
        {
            int userId = 1; // Context.User.Claims["..."]
            Message realMessage = await _messageService.SaveGlobalGroupMessageAsync(userId, messageText); 

            await Clients.All.SendAsync("ReceiveGlobalMessage", realMessage);
        }
    }
}
