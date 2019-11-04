using System.Threading.Tasks;

namespace WebChatBackend.Services
{
    public interface IFileService
    {
        Task<byte[]> ReadAsync(string path);
        Task SaveAsync(string path, byte[] content);
    }
}