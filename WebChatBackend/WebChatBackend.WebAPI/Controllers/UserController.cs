using Microsoft.AspNetCore.Mvc;
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
            var user = await _userService.LoginAsync(loginCredentials);
            if (user == null)
            {
                return Unauthorized();
            }

            return user;
        }
    }
}
