using System.ComponentModel.DataAnnotations;

namespace Pokebooook.Server.Models
{
    public class User
    {
        [Key]
        public int UserId { get; set; }

        [Required]
        [MaxLength(255)]
        public required string Email { get; set; }

        [Required]
        public required string Password { get; set; } 

        public bool IsAdmin { get; set; }
    }
}
