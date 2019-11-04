using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using WebChatBackend.Data.Models;
using WebChatBackend.Services;
using WebChatBackend.Services.Contracts;
using WebChatBackend.Services.UserManagement;


namespace WebChatBackend.WebAPI.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly IHostingEnvironment _hostingEnvironment;
       

        public UserController(IUserService userService, IConfiguration configuration, IHostingEnvironment hostingEnvironment)
        {
            _userService = userService;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginCredentials loginCredentials)
        {
            try
            {
                var loginResponse = await _userService.LoginAsync(loginCredentials);
                if (loginResponse == null)
                {
                    return Unauthorized();                         
                }
                return loginResponse;
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
                    return BadRequest("Error during registration");
                }

                return loginResponse;
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET api/users?search=...
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<List<BasicUserInfo>>> Get(bool excludeCurrent, string search)
        {
            string currentUserId = HttpContext.User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Sub)?.Value;
            return await _userService.GetAllUsersAsync(excludeCurrent, currentUserId, search);
        }

        // GET api/user/...
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<BasicUserInfo>> GetUser(string id)
        {
            return await _userService.GetUserAsync(id);
        }

        // POST api/user/update
        [HttpPost("update")]
        [Authorize]
        public async Task<ActionResult<UpdateUserResponse>> UpdateUser(BasicUserInfo userData)
        {
            string currentUserId = HttpContext.User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Sub)?.Value;
            if (userData.Id != currentUserId)
                return Unauthorized();

            return await _userService.UpdateUserAsync(userData);
        }

        // POST api/user/changePassword
        [HttpPost("changePassword")]
        [Authorize]
        public async Task<ActionResult<string>> ChangePassword(ChangePasswordRequest request)
        {
            string currentUserId = HttpContext.User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Sub)?.Value;
            if (request.UserId != currentUserId)
                return Unauthorized();

            return await _userService.ChangePasswordAsync(request);
        }

        // POST api/user/uploadPhoto
        [HttpPost("uploadProfilePicture")]
        //  [Authorize]
        public async Task<ActionResult<UpdateUserResponse>> uploadProfilePicture([FromForm] IFormFile imageInput)
        {
            string currentUserId = HttpContext.User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Sub)?.Value;

            try
            {
                using (var memoryStream = new MemoryStream())
                {
                    await imageInput.CopyToAsync(memoryStream);
                    byte[] content = memoryStream.ToArray();

                    var result =  await _userService.SaveUserProfilePicture(currentUserId, _hostingEnvironment.WebRootPath, imageInput.FileName, content);
                    return result;
                }
            }
            catch (Exception ex)
            {
                //TODO
                return new UpdateUserResponse()
                {
                    Success = false,
                    UserInfo = new BasicUserInfo(),
                    Error = "Error saving file"
                };
            }
        }
    }
}
