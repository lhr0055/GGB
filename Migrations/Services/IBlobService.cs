namespace RedMango_API.Migrations.Services
{
    public interface IBlobService
    {
        Task<string> GetBlob(string blobName, string containerName);
        //Task<string> DeleteBlob(string blobName, string containerName);
        Task<bool> DeleteBlob(string blobName, string containerName); //변경 
        Task<string> UploadBlob(string blobName, string containerName, IFormFile file);
    }
}
