using Microsoft.Extensions.Configuration;
using System;
using WebChatBackend.Data.Models;

namespace WebChatBackend.Services.UserManagement
{
    public class BasicUserInfo
    {        
        public string Id { get; set; }
        public string UserName { get; set; }
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
       
        public BasicUserInfo()
        {

        } 

        public BasicUserInfo(User u)
        {           
           
            Id = u.Id;
            UserName = u.UserName;
            ProfilePicturePath = u.ProfilePicturePath; 
        }

        private string GetPrivatePictureUrl()
        {
            string result = String.IsNullOrEmpty(profilePicturePath) ? "blankProfilePicture.png" : profilePicturePath.Replace('\\', '/');
            return result; 
        }
    }
}
