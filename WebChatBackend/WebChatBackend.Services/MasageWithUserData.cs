using System;
using System.ComponentModel.DataAnnotations;
using WebChatBackend.Data.Models;

namespace WebChatBackend.Services
{
    public class MessageWithUserData
    {
        public int Id { get; set; }
        public int? GroupId { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        [Required, MinLength(1)]
        public string Text { get; set; }
        public DateTime Date { get; set; }

        public MessageWithUserData()
        {

        }

        public MessageWithUserData(Message message)
        {
            Id = message.Id;
            GroupId = message.GroupId;
            UserId = message.UserId;
            UserName = message.GetUserName();
            Text = message.Text;
            Date = message.Date;
        }
    }
}
