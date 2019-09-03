using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using static Microsoft.AspNetCore.Hosting.Internal.HostingApplication;

namespace Chat.Hubs
{
    public class ChatHub: Hub
    {
        public async Task SendMessage(string name, string message)
        {
            await Clients.All.SendAsync("ReceiveMessage", name, message);
        }


        public Task JoinToGroup(string group)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, group);
        }

        public async Task SendMessageToGroup(string name, string message, string group)
        {
           
            await Clients.Group(group).SendAsync("ReceiveMessage", name, message, group);
            //await Clients.All.SendAsync("ReceiveMessage", name, message, group);
        }

        public async Task SendMessageToGlobalGroup(string name, string message)
        {            
            await Clients.All.SendAsync("ReceiveGlobalMessage", name, message);
        }

    }
}
