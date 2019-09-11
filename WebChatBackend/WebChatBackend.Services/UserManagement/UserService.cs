using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.Contracts;

namespace WebChatBackend.Services.UserManagement
{
    public class UserService: IUserService
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly IJwtGenerator _jwtGenerator;
        private readonly IConfiguration _configuration;

        public UserService(UserManager<User> userManager, SignInManager<User> signInManager, 
            IJwtGenerator jwtGenerator, IConfiguration configuration)
        {         
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtGenerator = jwtGenerator;
            _configuration = configuration;
        }

        public async Task<LoginResponse> LoginAsync(LoginCredentials loginCredentials)
        {
            var user = await _userManager.FindByEmailAsync(loginCredentials.Email);
            if (user == null)
            {
                return null; 
            }

            var signInResult = await _signInManager.CheckPasswordSignInAsync(user, loginCredentials.Password, false);
            if (!signInResult.Succeeded)
            {
                return null;
            }

            return new LoginResponse()
            {
                UserName = user.UserName,
                Token = _jwtGenerator.CreateToken(user, _configuration["SecurityKey"])
            };
        }

        //private async Task VerifyLoginCredentialsAsync(string userEmail, string Password)
        //{
        //    //bool result = await _context.UserGroup.AnyAsync(ug => ug.UserId == userId && ug.GroupId == groupId);
        //    //if (!result)
        //    //{
        //    //    throw new GroupAccessException();
        //    //}
        //}
    }
}
