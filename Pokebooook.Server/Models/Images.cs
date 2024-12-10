namespace Pokebooook.Server.Models
{
    public class Images
    {
        public int ImageId { get; set; }
        public required string ImageType { get; set; }
        public required byte[] ImageData { get; set; }
    }
}
