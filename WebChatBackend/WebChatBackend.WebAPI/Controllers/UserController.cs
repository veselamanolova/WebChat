using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using WebChatBackend.Services.Contracts;
using WebChatBackend.Services.UserManagement;

namespace WebChatBackend.WebAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }    
        
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginCredentials loginCredentials)         
        {
            try
            {
                var user = await _userService.LoginAsync(loginCredentials);
                if (user == null)
                {
                    return Unauthorized();
                }

                return user;
            }
            catch (Exception ex)
            {
                return Unauthorized(ex.Message);
            }
           
        }

        [HttpPost("register")]
        public async Task<ActionResult<LoginResponse>> Register(RegisterCredentials registerCredentials)
        {
            try
            {
                var loginResponse = await _userService.RegisterAsync(registerCredentials);
                if (loginResponse == null)
                {
                    return Unauthorized();
                }

                return loginResponse;
            }
            catch (ArgumentException ex)
            {
                return BadRequest( ex.Message);
            }
            
            
        }

    }
}
