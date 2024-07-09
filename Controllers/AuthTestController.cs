using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using RedMango_API.Migrations.Utility;

namespace RedMango_API.Controllers
{
    [Route("api/AuthTest")]
    [ApiController]
    public class AuthTestController : ControllerBase
    {
        [HttpGet] //사용자 인증 시 액세스 
        [Authorize]
        public async Task<ActionResult<string>> GetSomething()
        {
            return "authenticated";
        }
        [HttpGet("{id:int}")] // 관리자 역할 승인  
        [Authorize(Roles = SD.Role_Admin)]//endpoint에 엑세스할 수 있는 권한이 부여되는 역할 = 관리자 
        public async Task<ActionResult<string>> GetSomething(int someIntValue)
        {
            return "you  Admin";
        }
    }

}
