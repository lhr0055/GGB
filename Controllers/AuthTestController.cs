using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RedKimchi_API.Utility;

namespace RedKimchi_API.Controllers
{
    [Route("api/AuthTest")]
    [ApiController]
    public class AuthTestController : ControllerBase
    {
        [HttpGet]
        [Authorize]
        public async Task<ActionResult<string>> GetSomething()
        {
            return "You are authenticated";
        }

        [HttpGet("{id:int}")]
        [Authorize(Roles =SD.Role_Admin)]
        public async Task<ActionResult<string>> GetSomething(int someIntValue)
        {
            //authorization -> Authentication + Some access/roles
            //인증 -> 인증 + 일부액세스/역할까지 수행
            return "You are Authorized with Role of Admin";
        }
    }
}
