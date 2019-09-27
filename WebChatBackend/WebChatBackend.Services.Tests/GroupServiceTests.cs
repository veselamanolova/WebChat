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
            const string databaseName = nameof(CreateNewGroupAsyncShould_CreatePrivateChatIf2UserIdsAreProvided);
            using (var arrangeContext = new WebChatContext(TestUtils.GetOptions(databaseName)))
            {
                await arrangeContext.Users.AddAsync(new User { Id = "1", UserName = "User1" });
                await arrangeContext.Users.AddAsync(new User { Id = "2", UserName = "User2" });
                await arrangeContext.SaveChangesAsync();
            }

            using (var actContext = new WebChatContext(TestUtils.GetOptions(databaseName)))
            {
                GroupService sut = new GroupService(actContext);
                CreateGroupRequest groupRequest = new CreateGroupRequest()
                {
                    Name = null,
                    UserIds = new List<string>(new string[] { "1", "2" })
                };
                var result = await sut.CreateNewGroupAsync(groupRequest, "1");

                Assert.AreEqual(true, result.IsPrivateChat);
                Assert.IsTrue(DateTime.UtcNow - result.LastActivityDate < TimeSpan.FromSeconds(2));
            }
        }

        [TestMethod]
        public async Task CreateNewGroupAsyncShould_CreateGroupChatIf3UserIdsAreProvided()
        {
            const string databaseName = nameof(CreateNewGroupAsyncShould_CreateGroupChatIf3UserIdsAreProvided);
            using (var arrangeContext = new WebChatContext(TestUtils.GetOptions(databaseName)))
            {
                await arrangeContext.Users.AddAsync(new User { Id = "1", UserName = "User1" });
                await arrangeContext.Users.AddAsync(new User { Id = "2", UserName = "User2" });
                await arrangeContext.Users.AddAsync(new User { Id = "3", UserName = "User3" });
                await arrangeContext.SaveChangesAsync();
            }

            using (var actContext = new WebChatContext(TestUtils.GetOptions(databaseName)))
            {
                GroupService sut = new GroupService(actContext);
                CreateGroupRequest groupRequest = new CreateGroupRequest()
                {
                    Name = "test",
                    UserIds = { "1", "2", "3" }
                };
                var result = await sut.CreateNewGroupAsync(groupRequest, "1");

                Assert.AreEqual("test", result.Name);
                Assert.AreEqual(false, result.IsPrivateChat);
                Assert.IsTrue(DateTime.UtcNow - result.LastActivityDate < TimeSpan.FromSeconds(2));
            };
        }

        [TestMethod]
        public async Task CreateNewGroupAsyncShould_ReturntheSameChatIfItAlreadyExists()
        {
            const string databaseName = nameof(CreateNewGroupAsyncShould_ReturntheSameChatIfItAlreadyExists); 
            using (var arrangeContext = new WebChatContext(TestUtils.GetOptions(databaseName)))
            {
                var user1 = new User() { Id = "1", UserName = "User1" };
                var user2 = new User() { Id = "2", UserName = "User2" };

                await arrangeContext.Users.AddAsync(user1);
                await arrangeContext.Users.AddAsync(user2);

                var UserGroup1 = new UserGroup(){UserId = "1",GroupId = 1, User = user1};
                var UserGroup2 = new UserGroup() { UserId = "2", GroupId = 1, User = user2 };
               
                var Group1UserGroups = new List<UserGroup>();
                Group1UserGroups.Add(UserGroup1);
                Group1UserGroups.Add(UserGroup2);
              
                var oldGroup = new Group()
                {
                    Id = 1,
                    IsPrivateChat = true,
                    LastActivityDate = new DateTime(2019, 5, 5),
                    UserGroups = Group1UserGroups
                };
                await arrangeContext.Groups.AddAsync(oldGroup);
                arrangeContext.SaveChanges();
            }


            using (var actContext  =
               new WebChatContext(TestUtils.GetOptions(databaseName)))
            {
                GroupService sut = new GroupService(actContext);

                var groupRequest = new CreateGroupRequest(){ Name = null, UserIds = { "1", "2" }};
                var result = await sut.CreateNewGroupAsync(groupRequest, "1");

                Assert.AreEqual(1, result.Id);
                Assert.AreEqual(true, result.IsPrivateChat);
                Assert.AreEqual(new DateTime(2019, 5, 5),result.LastActivityDate);
            };
        }


        [TestMethod]
        public async Task GetUserGroupsAsyncShould_ReturnUserGroups()
        {
            const string databaseName = nameof(GetUserGroupsAsyncShould_ReturnUserGroups); 

            using (var arrangeContext =
                new WebChatContext(TestUtils.GetOptions(databaseName)))
            {               
                CreateGroupRequest groupRequest = new CreateGroupRequest()
                {
                    Name = null,
                    UserIds = { "1", "2" }
                };

                var user1 = new User() { Id = "1", UserName = "User1" };
                var user2 = new User() { Id = "2", UserName = "User2" };              

                await arrangeContext.Users.AddAsync(user1);
                await arrangeContext.Users.AddAsync(user2);

                var UserGroup1 = new UserGroup() { UserId = "1", GroupId = 1, User = user1 };
                var UserGroup2 = new UserGroup() { UserId = "2", GroupId = 1, User = user2 };

                var Group1UserGroups = new List<UserGroup>{ UserGroup1, UserGroup2 };

                await arrangeContext.UserGroups.AddAsync(UserGroup1);
                await arrangeContext.UserGroups.AddAsync(UserGroup2);

                var Group = new Group()
                {
                    Id = 1,
                    IsPrivateChat = true,
                    LastActivityDate = new DateTime(2019, 5, 5),
                    UserGroups = Group1UserGroups
                };
                await arrangeContext.Groups.AddAsync(Group);
                arrangeContext.SaveChanges();
            }

            using (var actContext =
                new WebChatContext(TestUtils.GetOptions(databaseName)))
            {
                GroupService sut = new GroupService(actContext);
              
                var result = await sut.GetUserGroupsAsync("1");
                Assert.AreEqual(1, result.Count);
                Assert.AreEqual(1, result[0].Id);                
            };
        }


        [TestMethod]
        public async Task GetUserGroupsAsyncShould_ReturnEmptyUserGroupsListIfNoUserGroupsExist()
        {
            const string databaseName = nameof(GetUserGroupsAsyncShould_ReturnEmptyUserGroupsListIfNoUserGroupsExist);

            using (var arrangeContext =
                new WebChatContext(TestUtils.GetOptions(databaseName)))
            {
                CreateGroupRequest groupRequest = new CreateGroupRequest()
                {
                    Name = null,
                    UserIds = { "3", "2" }
                };

                var user2 = new User() { Id = "2", UserName = "User2" };
                var user3 = new User() { Id = "3", UserName = "User3" };

                await arrangeContext.Users.AddAsync(user2);
                await arrangeContext.Users.AddAsync(user3);
               
                var UserGroup2 = new UserGroup() { UserId = "2", GroupId = 1, User = user2 };
                var UserGroup1 = new UserGroup() { UserId = "3", GroupId = 1, User = user3 };

                var Group1UserGroups = new List<UserGroup> { UserGroup1, UserGroup2 };

                await arrangeContext.UserGroups.AddAsync(UserGroup1);
                await arrangeContext.UserGroups.AddAsync(UserGroup2);

                var Group = new Group()
                {
                    Id = 1,
                    IsPrivateChat = true,
                    LastActivityDate = new DateTime(2019, 5, 5),
                    UserGroups = Group1UserGroups
                };
                await arrangeContext.Groups.AddAsync(Group);
                arrangeContext.SaveChanges();
            }

            using (var actContext =
                new WebChatContext(TestUtils.GetOptions(databaseName)))
            {
                GroupService sut = new GroupService(actContext);
                var result = await sut.GetUserGroupsAsync("1");
                Assert.AreEqual(0, result.Count);                
            };
        }


    }
}

