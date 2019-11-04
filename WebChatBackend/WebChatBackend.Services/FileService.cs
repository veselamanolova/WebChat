using System;
using System.IO;
using System.Threading.Tasks;

namespace WebChatBackend.Services
{
    public class FileService : IFileService
    {
        public async Task SaveAsync(string path, byte[] content)
        {
            try
            {
                string directory = Path.GetDirectoryName(path);
                if(!Directory.Exists(directory))
                    Directory.CreateDirectory(directory);

                await File.WriteAllBytesAsync(path, content);
            }
            catch (Exception ex)
            {

                throw;
            }
            
        }

        public async Task<byte[]> ReadAsync(string path)
        {
            return await File.ReadAllBytesAsync(path);
        }
    }
}
