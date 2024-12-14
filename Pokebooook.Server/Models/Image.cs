using System.ComponentModel.DataAnnotations;

namespace Pokebooook.Server.Models
{
    public class Image
    {
        [Key]
        public int ImageId { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        [MaxLength(50)]
        public required string Type { get; set; }

        [Required]
        public required byte[] Data { get; set; }
    }
}
