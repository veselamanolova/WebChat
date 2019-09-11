using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using WebChatBackend.Data.Models;

namespace WebChatBackend.Data
{
    public class Seed
    {
        public static async System.Threading.Tasks.Task SeedDataAsync(WebChatContext context, UserManager<User> userManager)
        {
            if (!context.Users.Any())
            {
                var users = new List<User>
                {
                    new User {
                    UserName = "Vesi",
                    Email = "vesi@test.com"
                    },
                    new User
                    {
                        UserName = "Rumen",
                        Email = "rumen@test.com"
                    },
                      new User
                      {
                          UserName = "Maya",
                          Email = "maya@test.com"
                      }
                }; 

                foreach(var user in users)
                {
                   await userManager.CreateAsync(user, "Pa$$w0rd"); 
                }
            }
        }
    }
}

