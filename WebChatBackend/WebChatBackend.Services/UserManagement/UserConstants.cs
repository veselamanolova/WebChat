using System;

namespace WebChatBackend.Services.UserManagement
{
    public static class UserConstants
    {
        public const string EmptyEmail = "Please provide e-mail!";
        public const string EmptyPassword = "Please provide passsword!";
        public const string EmptyUserName = "Please provide userName!";
        public const string EmailIsOccupied = "There is already a user registered with this e-mail. Choose another e-mail";
        public const string NameIsOccupied = "There is already a user registered with this name. Choose another e-mail";
    }
}
