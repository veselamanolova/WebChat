using Microsoft.EntityFrameworkCore;
using WebChatBackend.Data; 


namespace WebChatBackend.Services.Tests
{
    public static class TestUtils
    {
        public static DbContextOptions<WebChatContext> GetOptions(string databaseName) =>
            new DbContextOptionsBuilder<WebChatContext>()
                .UseInMemoryDatabase(databaseName)
                .Options;
    }
}