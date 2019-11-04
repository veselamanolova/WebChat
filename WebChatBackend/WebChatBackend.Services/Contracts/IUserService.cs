using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Threading.Tasks;
using WebChatBackend.Services.UserManagement;

namespace WebChatBackend.Services.Contracts
{
    public interface IUserService
    {
        Task<LoginResponse> LoginAsync(LoginCredentials loginCredentials);
        Task<LoginResponse> RegisterAsync(RegisterCredentials registerCredentials);
        Task<List<BasicUserInfo>> GetAllUsersAsync(bool excludeCurrent, string currentUserId, string search);
        Task<BasicUserInfo> GetUserAsync(string id);
        Task<UpdateUserResponse> UpdateUserAsync(BasicUserInfo userData);
        Task<string> ChangePasswordAsync(ChangePasswordRequest request);
        Task<UpdateUserResponse> SaveUserProfilePicture(string userId, string folder, string fileName, byte[] content); 
    }
}
