using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Pokebooook.Server.Models
{
    public class Connection
    {
        [Key]
        public int ConnectionId { get; set; }

        [ForeignKey("LocationFrom")]
        public int LocationFromId { get; set; }
        public Location? LocationFrom { get; set; }

        [ForeignKey("LocationTo")]
        public int LocationToId { get; set; }
        public Location? LocationTo { get; set; }
    }
}
