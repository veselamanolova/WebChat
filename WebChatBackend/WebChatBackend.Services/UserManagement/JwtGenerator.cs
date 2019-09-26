using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.Contracts;

namespace WebChatBackend.Services.UserManagement
{
    public class JwtGenerator : IJwtGenerator
    {
        public string CreateToken(User user, string securityKey)
        {
            var claims = new List<Claim>
            {
               new Claim(JwtRegisteredClaimNames.Sub, user.Id)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(securityKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds

            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);

        }
    }
}
