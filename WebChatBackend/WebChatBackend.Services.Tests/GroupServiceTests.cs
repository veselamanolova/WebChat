using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using WebChatBackend.Data;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.Groups;
using WebChatBackend.Services.UserManagement;

namespace WebChatBackend.Services.Tests
{
    [TestClass]
    public class GroupServiceTests
    {
        [TestMethod]
        public async Task CreateNewGroupAsyncShould_CreatePrivateChatIf2UserIdsAreProvided()
        {
            var options = new DbContextOptionsBuilder()
               .UseInMemoryDatabase(databaseName: "CreateNewGroupAsyncShould_CreatePrivateChatIf2UserIdsAreProvided")
               .Options;

            using (var actAndAssertContext =
                new WebChatContext(TestUtils.GetOptions(nameof(CreateNewGroupAsyncShould_CreatePrivateChatIf2UserIdsAreProvided))))
            {
                GroupService sut = new GroupService(actAndAssertContext);
                CreateGroupRequest groupRequest = new CreateGroupRequest()
                {
                    Name = null,
                    UserIds = new List<string>(new string[] { "1", "2" })
                };
               
                  var user1 = new User()
                {
                    Id = "1",
                    UserName = "User1"
                };
                var user2 = new User()
                {
                    Id = "2",
                    UserName = "User2"
                };

                await actAndAssertContext.Users.AddAsync(user1);
                await actAndAssertContext.Users.AddAsync(user2);                

                var result = await sut.CreateNewGroupAsync(groupRequest, "1");
               
                Assert.AreEqual(true, result.IsPrivateChat);
                Assert.IsTrue(DateTime.UtcNow- result.LastActivityDate < TimeSpan.FromSeconds(2));
            };
        }

        [TestMethod]
        public async Task CreateNewGroupAsyncShould_CreateGroupChatIf3UserIdsAreProvided()
        {
            var options = new DbContextOptionsBuilder()
               .UseInMemoryDatabase(databaseName: "CreateNewGroupAsyncShould_CreateGroupChatIf3UserIdsAreProvided")
               .Options;

            using (var actAndAssertContext =
                new WebChatContext(TestUtils.GetOptions(nameof(CreateNewGroupAsyncShould_CreateGroupChatIf3UserIdsAreProvided))))
            {
                GroupService sut = new GroupService(actAndAssertContext);
                CreateGroupRequest groupRequest = new CreateGroupRequest()
                {
                    Name = "test",
                    UserIds = new List<string>(new string[] { "1", "2" , "3"})
                };

                var user1 = new User()
                {
                    Id = "1",
                    UserName = "User1"
                };              
                var user2 = new User()
                {
                    Id = "2",
                    UserName = "User2"
                };
                var user3 = new User()
                {
                    Id = "3",
                    UserName = "User3"
                };

                await actAndAssertContext.Users.AddAsync(user1);
                await actAndAssertContext.Users.AddAsync(user2);
                await actAndAssertContext.Users.AddAsync(user3);

                var result = await sut.CreateNewGroupAsync(groupRequest, "1");

                Assert.AreEqual("test", result.Name);
                Assert.AreEqual(false, result.IsPrivateChat);
                Assert.IsTrue(DateTime.UtcNow - result.LastActivityDate < TimeSpan.FromSeconds(2));
            };
        }    


    }
}

