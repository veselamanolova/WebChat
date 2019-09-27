using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Text;
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

            using (var actcontext = new WebChatContext(TestUtils.GetOptions(databaseName)))
            {
                var sut = new MessageService(actcontext);
                MessageWithUserData result = await sut.SaveGlobalGroupMessageAsync("1", "Message1");

                Assert.AreEqual(1, result.Id);
                Assert.IsNull(result.GroupId);
                Assert.AreEqual("1", result.UserId);
                Assert.AreEqual("Message1", result.Text);
                Assert.IsTrue(DateTime.UtcNow - DateTime.Parse(result.Date) < TimeSpan.FromSeconds(2));
            }
        }
    }
}

