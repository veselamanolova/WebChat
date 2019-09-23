﻿using System.Collections.Generic;
using System.Threading.Tasks;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.UserManagement;

namespace WebChatBackend.Services.Contracts
{
    public interface IUserService
    {
        Task<LoginResponse> LoginAsync(LoginCredentials loginCredentials);
        Task<LoginResponse> RegisterAsync(RegisterCredentials registerCredentials);
        Task<List<BasicUserInfo>> GetAllUsersAsync(string search);
        Task<BasicUserInfo> GetUserAsync(string id);
        Task<UpdateUserResponse> UpdateUserAsync(BasicUserInfo userData);
        Task<string> ChangePasswordAsync(ChangePasswordRequest request);
    }
}
