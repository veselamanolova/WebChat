using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebChatBackend.Data;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.Contracts;

namespace WebChatBackend.Services.UserManagement
{
    public class UserService: IUserService
    {
        private readonly WebChatContext _context;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IJwtGenerator _jwtGenerator;
        private readonly IConfiguration _configuration;
        private readonly IFileService _fileService;

        public UserService(WebChatContext context, UserManager<User> userManager, SignInManager<User> signInManager, 
            IJwtGenerator jwtGenerator, IConfiguration configuration, IFileService fileService)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtGenerator = jwtGenerator;
            _configuration = configuration;
            _fileService = fileService;
        }

        public async Task<List<BasicUserInfo>> GetAllUsersAsync(bool excludeCurrent, string currentUserId, string searchText) =>
           await _context.Users
            .Where(u => (string.IsNullOrEmpty(searchText) || u.UserName.Contains(searchText))
                    && (!excludeCurrent || u.Id != currentUserId))
            .Select(u => new BasicUserInfo()
           {
               Id = u.Id,
               UserName = u.UserName, 
               ProfilePicturePath = u.ProfilePicturePath
            })
            .OrderBy(u => u.UserName)
            .ToListAsync();

        public async Task<BasicUserInfo> GetUserAsync(string id) =>
           await _context.Users
            .Where(u => u.Id == id)
            .Select(u => new BasicUserInfo()
            {
                Id = u.Id,
                UserName = u.UserName,
                ProfilePicturePath = u.ProfilePicturePath
            })
            .SingleOrDefaultAsync();

       

        public async Task<LoginResponse> LoginAsync(LoginCredentials loginCredentials)
        {
            if (String.IsNullOrEmpty(loginCredentials.Email))
            {
                throw new ArgumentException("Please provide e-mail!"); 
            }

            if (String.IsNullOrEmpty(loginCredentials.Password))
            {
                throw new ArgumentException("Please provide passsword!");
            }

            var user = await _userManager.FindByEmailAsync(loginCredentials.Email);
            if (user == null)
            {
                throw new Exception("User not found"); 
            }

            var signInResult = await _signInManager.CheckPasswordSignInAsync(user, loginCredentials.Password, false);
            if (!signInResult.Succeeded)
            {
                throw new Exception("Unsuccessful login"); 
            }

            return new LoginResponse()
            {
                UserId = user.Id,
                UserName = user.UserName,
                Token = _jwtGenerator.CreateToken(user, _configuration["SecurityKey"]), 
                ProfilePicturePath = user.ProfilePicturePath
            };
        }

        public async Task<LoginResponse> RegisterAsync(RegisterCredentials registerCredentials)
        {
            if (String.IsNullOrEmpty(registerCredentials.UserName))
            {
                throw new ArgumentException(UserConstants.EmptyUserName);
            }

            if (String.IsNullOrEmpty(registerCredentials.Email))
            {
                throw new ArgumentException(UserConstants.EmptyEmail);
            }

            if (String.IsNullOrEmpty(registerCredentials.Password))
            {
                throw new ArgumentException(UserConstants.EmptyPassword);
            }

            if( await _context.Users.Where(x=> x.Email == registerCredentials.Email).AnyAsync())
            {
                throw new ArgumentException(UserConstants.EmailIsOccupied); 
            }

            if (await _context.Users.Where(x => x.UserName == registerCredentials.UserName).AnyAsync())
            {
                throw new ArgumentException(UserConstants.NameIsOccupied);
            }

            var user = new User
            {
                UserName = registerCredentials.UserName,
                Email = registerCredentials.Email,
            }; 

            await _userManager.CreateAsync(user, registerCredentials.Password);

            if (user == null)
            {
                return null;
            }

            var signInResult = await _signInManager.CheckPasswordSignInAsync(user, registerCredentials.Password, false);
            if (!signInResult.Succeeded)
            {
                return null;
            }

            return new LoginResponse()
            {
                UserId = user.Id,
                UserName = user.UserName,
                Token = _jwtGenerator.CreateToken(user, _configuration["SecurityKey"]),
                ProfilePicturePath = user.ProfilePicturePath
            };
        }

        public async Task<string> ChangePasswordAsync(ChangePasswordRequest request)
        {
            User user = await _context.Users.SingleAsync(u => u.Id == request.UserId);
            IdentityResult identityResult = await _userManager.ChangePasswordAsync(user, request.OldPassword, request.NewPassword);
            if (identityResult.Succeeded)
                return "";
            var result = new StringBuilder();
            foreach (IdentityError error in identityResult.Errors)
            {
                result.Append(error.Description + " ");
            }
            return result.ToString();
        }

        public async Task<UpdateUserResponse> UpdateUserAsync(BasicUserInfo userData)
        {
            User user = await _context.Users
                .Where(u => u.Id == userData.Id)
                .SingleOrDefaultAsync();
            if (user == null)
                return null;

            IdentityResult identityResult = await _userManager.SetUserNameAsync(user, userData.UserName);
            var result = new UpdateUserResponse
            {
                Success = identityResult.Succeeded,
                Error = identityResult.Succeeded ? null : string.Join(' ', identityResult.Errors.Select(e => e.Description)),
                UserInfo = !identityResult.Succeeded ? null : new BasicUserInfo(user)                
            };
            return result;
        }


      
        public async Task<UpdateUserResponse> SaveUserProfilePicture(string userId, string folder, string fileName, byte[] content)
        {
            string filePath = Path.Combine(folder, userId, fileName);
            await _fileService.SaveAsync(filePath, content);
            // TODO: save profile picture file path in DB$
            User user = await _context.Users.FirstAsync(x => x.Id == userId);
            user.ProfilePicturePath = Path.Combine(userId, fileName);
            await _context.SaveChangesAsync();

            return new UpdateUserResponse
            {
                Success = true,
                UserInfo = new BasicUserInfo(user),
                Error = ""
            }; 
        }

    }
}
