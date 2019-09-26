using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebChatBackend.Data.Models;

namespace WebChatBackend.Data
{
    public class Seed
    {
        public static async Task SeedDataAsync(WebChatContext context, UserManager<User> userManager)
        {
            if (!context.Users.Any())
            {
                List<User> users = await SeedUsers(userManager);

                await SeedPublicGroupAsync(context, users);                 
                await SeedGroup(context, users, "First Group");
                await SeedGroup(context, users, null);               
                await SeedChat(context, users.Take(2).ToList());
                await SeedChat(context, users.Skip(1).Take(2).ToList());
            }
        }


        private static async Task SeedPublicGroupAsync(WebChatContext context, List<User> users)
        {
            var messages = new List<Message>();
            for (int i = 0; i < 30; i++)
            {
                context.Messages.AddRange(new Message()
                {
                    GroupId = null,
                    UserId = users[(i > 25) ? i % i : 2].Id,
                    Text = $"Public group message {i}",
                    Date = DateTime.UtcNow.AddDays((i > 25) ? 0 : -30 + i)
                });
                await context.SaveChangesAsync();
            }            
        }

        private static async Task SeedChat(WebChatContext context, List<User> users)
        {
            await SeedGroup(context, users, null); 
        }

        private static async Task SeedGroup(WebChatContext context, List<User> users, string name)
        {
            int numberOfUsers = users.Count; 
            Group group = new Group()
            {
                Name = name,
                IsPrivateChat = (numberOfUsers == 2),
                LastActivityDate = DateTime.UtcNow,
                UserGroups = new List<UserGroup>()
            };

            var firstChatResultUserGroups = await context.Groups.AddAsync(group);

            var userGroups = new List<UserGroup>(); 
            for (int i = 0; i < numberOfUsers; i++)
            {
                userGroups.Add(new UserGroup()
                {
                    GroupId = group.Id,
                    UserId = users[i% numberOfUsers].Id
                });
            }

            context.UserGroups.AddRange(userGroups);
            await context.SaveChangesAsync();
            
            int userIdIndex = 0; 
            for (int i = 1; i <= 20; i++)
            {
                if (i < 10){ userIdIndex = i % numberOfUsers; }
                else if (i <= 15) { userIdIndex = numberOfUsers - 1; }
                else { userIdIndex = numberOfUsers - 2; }
                context.Messages.Add(new Message()
                {
                    GroupId = group.Id,
                    UserId = users[userIdIndex].Id,
                    Text = $"Message {i}",
                    Date = DateTime.UtcNow
                }); 
                await context.SaveChangesAsync(); 
            }
        }

        private static async Task<List<User>> SeedUsers(UserManager<User> userManager)
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

            foreach (var user in users)
            {
              await userManager.CreateAsync(user, "Pa$$w0rd");                  
            }
            return users;            
        }
    }
}

