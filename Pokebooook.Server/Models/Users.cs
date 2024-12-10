namespace Pokebooook.Server.Models
{
    public class Users
    {
        public required int UserId { get; set; }
        public required string email { get; set; }
        public required string password { get; set; }
        public required bool isAdmin { get; set; }  


    }
}
