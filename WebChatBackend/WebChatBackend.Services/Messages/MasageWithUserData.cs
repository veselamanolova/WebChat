using System;
using System.ComponentModel.DataAnnotations;
using WebChatBackend.Data.Models;

namespace WebChatBackend.Services.Messages
{
    public class MessageWithUserData
    {
        public int Id { get; set; }
        public int? GroupId { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        [Required, MinLength(1)]
        public string Text { get; set; }
        public string Date { get; set; }
        private string profilePicturePath;
        public string ProfilePicturePath
        {
            get
            {
                return GetPrivatePictureUrl();
            }
            set
            {
                profilePicturePath = value;
            }
        }

        public MessageWithUserData()
        {

        }

        public MessageWithUserData(Message message)
        {
            Id = message.Id;
            GroupId = message.GroupId;
            UserId = message.UserId;
            UserName = message.User.UserName;
            ProfilePicturePath = message.User.ProfilePicturePath;
            Text = message.Text;
            Date = message.Date.ToString("yyyy-MM-ddTHH:mm:ssZ");
        }

        private string GetPrivatePictureUrl()
        {
            string result = String.IsNullOrEmpty(profilePicturePath) ? "" : profilePicturePath.Replace('\\', '/');
            return result;
        }
    }


}
