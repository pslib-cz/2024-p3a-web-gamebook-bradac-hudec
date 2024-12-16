using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Pokebooook.Server.Models
{
    public class Item
    {
        [Key]
        public int ItemId { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public required string Description { get; set; }

        [ForeignKey("Image")]
        [Required]
        public required int ImageId { get; set; }
    }
}
