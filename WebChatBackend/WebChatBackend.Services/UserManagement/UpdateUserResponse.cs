namespace WebChatBackend.Services.UserManagement
{
    public class UpdateUserResponse
    {
        public bool Success { get; set; }
        public BasicUserInfo UserInfo { get; set; }
        public string Error { get; set; }
    }
}