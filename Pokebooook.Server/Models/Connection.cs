using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Pokebooook.Server.Models
{
    public class Connection
    {
        [Key]
        public int ConnectionId { get; set; }

        [ForeignKey("LocationFrom")]
        public int LocationFromId { get; set; }
        public required Location LocationFrom { get; set; } 

        [ForeignKey("LocationTo")]
        public int LocationToId { get; set; }
        public required Location LocationTo { get; set; } 
    }
}
