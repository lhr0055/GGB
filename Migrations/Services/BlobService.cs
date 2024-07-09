using Azure.Storage.Blobs;  //추가
using Azure.Storage.Blobs.Models;  //추가

namespace RedMango_API.Migrations.Services
{
    public class BlobService : IBlobService
    {
        private readonly BlobServiceClient _blobClient;// 추가
        public async Task<bool> DeleteBlob(string blobName, string containerName) //변경 및 추가 ~  
        {
            BlobContainerClient blobContainerClient = _blobClient.GetBlobContainerClient(containerName);
            BlobClient blobClient = blobContainerClient.GetBlobClient(blobName);

            return await blobClient.DeleteIfExistsAsync();
        }
        public async Task<string> GetBlob(string blobName, string containerName)
        {
            BlobContainerClient blobContainerClient = _blobClient.GetBlobContainerClient(containerName);
            BlobClient blobClient = blobContainerClient.GetBlobClient(blobName);

            return blobClient.Uri.AbsoluteUri;
        }
        public async Task<string> UploadBlob(string blobName, string containerName, IFormFile file)
        {
            BlobContainerClient blobContainerClient = _blobClient.GetBlobContainerClient(containerName);
            BlobClient blobClient = blobContainerClient.GetBlobClient(blobName);
            var httpHeaders = new BlobHttpHeaders()
            {
                ContentType = file.ContentType
            };
            var result = await blobClient.UploadAsync(file.OpenReadStream(),httpHeaders);
            if (result != null)
            {
                return await GetBlob(blobName, containerName);
            }
            return "";
        }
    }
}