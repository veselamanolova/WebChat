using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebChatBackend.Common;
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

        public UserService(WebChatContext context, UserManager<User> userManager, SignInManager<User> signInManager, 
            IJwtGenerator jwtGenerator, IConfiguration configuration)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _jwtGenerator = jwtGenerator;
            _configuration = configuration;
        }

        public async Task<List<BasicUserInfo>> GetAllUsers() =>
           await _context.Users.Select(u => new BasicUserInfo
           {
               Id = u.Id,
               UserName = u.UserName
           })
            .OrderBy(u => u.UserName)
            .ToListAsync();

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
                return null; 
            }

            var signInResult = await _signInManager.CheckPasswordSignInAsync(user, loginCredentials.Password, false);
            if (!signInResult.Succeeded)
            {
                return null;
            }

            return new LoginResponse()
            {
                UserId = user.Id,
                UserName = user.UserName,
                Token = _jwtGenerator.CreateToken(user, _configuration["SecurityKey"])
            };
        }

        public async Task<LoginResponse> RegisterAsync(RegisterCredentials registerCredentials)
        {
            if (String.IsNullOrEmpty(registerCredentials.UserName))
            {
                throw new ArgumentException(GlobalConstants.emptyUserName);
            }

            if (String.IsNullOrEmpty(registerCredentials.Email))
            {
                throw new ArgumentException(GlobalConstants.emptyEmail);
            }

            if (String.IsNullOrEmpty(registerCredentials.Password))
            {
                throw new ArgumentException(GlobalConstants.emptyPassword);
            }

            if( await _context.Users.Where(x=> x.Email == registerCredentials.Email).AnyAsync())
            {
                throw new ArgumentException(GlobalConstants.emailIsOccupied); 
            }

            if (await _context.Users.Where(x => x.UserName == registerCredentials.UserName).AnyAsync())
            {
                throw new ArgumentException(GlobalConstants.nameIsOccupied);
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
                Token = _jwtGenerator.CreateToken(user, _configuration["SecurityKey"])
            };
        }

    }
}
