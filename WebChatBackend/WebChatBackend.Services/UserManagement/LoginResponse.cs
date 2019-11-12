using System;
using System.Collections.Generic;
using System.Text;

namespace WebChatBackend.Services.UserManagement
{
    public class LoginResponse
    {
        private string profilePicturePath;

        public string UserId { get; set; }
        public string UserName { get; set;  }
        public string Token { get; set; }     

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

        private string GetPrivatePictureUrl()
        {
            string result = String.IsNullOrEmpty(profilePicturePath) ? "blankProfilePicture.png" : profilePicturePath.Replace('\\', '/');
            return result;
        }
    }
}
