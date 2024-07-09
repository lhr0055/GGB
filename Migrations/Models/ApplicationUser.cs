using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace RedMango_API.Migrations.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string Name { get; set; } 
    }
}
