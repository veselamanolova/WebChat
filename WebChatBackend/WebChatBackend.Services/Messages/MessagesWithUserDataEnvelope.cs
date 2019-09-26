using System;
using System.Collections.Generic;
using System.Text;

namespace WebChatBackend.Services.Messages
{
    public class MessagesWithUserDataEnvelope
    {
        public int TotalMessages { get; set; }
        public List<MessageWithUserData> Messages { get; set; }      
    }
}
