using Microsoft.EntityFrameworkCore;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Threading.Tasks;
using WebChatBackend.Data;
using WebChatBackend.Data.Models;
using WebChatBackend.Services.Messages;

namespace WebChatBackend.Services.Tests
{
    [TestClass]
    public class MessagesServiceTests
    {
        [TestMethod]
        public async Task SaveGlobalGroupMessageAsync_SaveMessageToGlobalGroup()
        {
            const string databaseName = nameof(SaveGlobalGroupMessageAsync_SaveMessageToGlobalGroup);
            using (var arrangeContext = new WebChatContext(TestUtils.GetOptions(databaseName)))
            {
                await arrangeContext.Users.AddAsync(new User { Id = "1", UserName = "User1" });              
                await arrangeContext.SaveChangesAsync();
            }

            using (var actContext = new WebChatContext(TestUtils.GetOptions(databaseName)))
            {
                var sut = new MessageService(actContext);
                MessageWithUserData result = await sut.SaveGlobalGroupMessageAsync("1", "Message1");
                Assert.AreEqual(1, result.Id);
                Assert.IsNull(result.GroupId);
                Assert.AreEqual("1", result.UserId);
                Assert.AreEqual("User1", result.UserName);
                Assert.AreEqual("Message1", result.Text);
                Assert.IsTrue(DateTime.UtcNow - DateTime.Parse(result.Date) < TimeSpan.FromSeconds(2));
            }
        }

        [TestMethod]
        public async Task SaveGroupMessageAsync_SaveMessageToGroup()
        {
            const string databaseName = nameof(SaveGroupMessageAsync_SaveMessageToGroup);
            using (var arrangeContext = new WebChatContext(TestUtils.GetOptions(databaseName)))
            {
                await arrangeContext.Users.AddAsync(new User { Id = "1", UserName = "User1" });
                await arrangeContext.Groups.AddAsync(new Group { Id = 1, Name = "Group1" });
                await arrangeContext.UserGroups.AddAsync(new UserGroup { UserId = "1", GroupId= 1 });   
                await arrangeContext.SaveChangesAsync();
            }

            using (var actContext = new WebChatContext(TestUtils.GetOptions(databaseName)))
            {
                var sut = new MessageService(actContext);
                MessageWithUserData result = await sut.SaveGroupMessageAsync("1", "Message1", 1);
                Assert.AreEqual(1, result.GroupId);
                Assert.AreEqual("User1", result.UserName);
                Assert.AreEqual("1", result.UserId);
                Assert.AreEqual("Message1", result.Text);
                Assert.IsTrue(DateTime.UtcNow - DateTime.Parse(result.Date) < TimeSpan.FromSeconds(2));
            }
        }

        [TestMethod]
        public async Task SaveGroupMessageAsync_UpdatesGroupLastActivityDate()
        {
            const string databaseName = nameof(SaveGroupMessageAsync_UpdatesGroupLastActivityDate);
            using (var arrangeContext = new WebChatContext(TestUtils.GetOptions(databaseName)))
            {
                await arrangeContext.Users.AddAsync(new User { Id = "1", UserName = "User1" });
                await arrangeContext.Groups.AddAsync(new Group { Id = 1, Name = "Group1" });
                await arrangeContext.UserGroups.AddAsync(new UserGroup { UserId = "1", GroupId = 1 });
                await arrangeContext.SaveChangesAsync();
            }

            using (var actContext = new WebChatContext(TestUtils.GetOptions(databaseName)))
            {
                var sut = new MessageService(actContext);
                await sut.SaveGroupMessageAsync("1", "Message1", 1);
                var result  = await  actContext.Groups.FirstAsync(g => g.Name == "Group1");  

                Assert.IsTrue(DateTime.UtcNow - result.LastActivityDate < TimeSpan.FromSeconds(2));
            }
        }

        [TestMethod]
        public async Task SaveGroupMessageAsync_ThrowsIfUserDoesNotBelongToAGroup()
        {
            const string databaseName = nameof(SaveGroupMessageAsync_ThrowsIfUserDoesNotBelongToAGroup);
            using (var arrangeContext = new WebChatContext(TestUtils.GetOptions(databaseName)))
            {
                await arrangeContext.Users.AddAsync(new User { Id = "1", UserName = "User1" });
                await arrangeContext.Groups.AddAsync(new Group { Id = 1, Name = "Group1" });
                await arrangeContext.UserGroups.AddAsync(new UserGroup { UserId = "2", GroupId = 1 });
                await arrangeContext.SaveChangesAsync();
            }

            using (var actContext = new WebChatContext(TestUtils.GetOptions(databaseName)))
            {
                var sut = new MessageService(actContext);                
                await Assert.ThrowsExceptionAsync<GroupAccessException>(() =>sut.SaveGroupMessageAsync("1", "Message1", 1));
            }
        }

    }
}

