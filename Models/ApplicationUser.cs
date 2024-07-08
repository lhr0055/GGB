using Microsoft.AspNetCore.Identity;

namespace RedKimchi_API.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; }
    }
}
