using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using RedMango_API.Data;
using RedMango_API.Migrations.Models.Dto;
using RedMango_API.Migrations.Models;
using RedMango_API.Migrations.Utility;
using System.Net;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RedMango_API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private ApiResponse _response;
        private readonly UserManager<ApplicationUser> _userManager; //읽기 전용 사용자 관리자
        private readonly RoleManager<IdentityRole> _roleManager; //역할 관리자 
        private string secretKey;
        public AuthController(ApplicationDbContext db, IConfiguration configuration,
            UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _db = db;
            secretKey = configuration.GetValue<string>("ApiSettings:Secret");
            //IE구성을 사용하여 앱 설정의 구성 값에 액세스 할 수 있는 방법이다. 
            _response = new ApiResponse();
            _userManager = userManager;
            _roleManager = roleManager;
        }


        //추가된 내용 
        [HttpPost("login")] //이 엔드포인내에서 사용자를 등록하거나 생성해야 합니다. 
        public async Task<IActionResult> Login([FromBody] LoginRequestDTO model)
        {
            ApplicationUser userFromDb = _db.ApplicationUsers
                .FirstOrDefault(u => u.UserName.ToLower() == model.UserName.ToLower());
            //server에 들어가서 비밀번호를 확인해보면 해시된 비밀번호를 확인할 수 있다.

            bool isValid = await _userManager.CheckPasswordAsync(userFromDb, model.Password);

            if (isValid == false) //잘못된 요청은 오류 메시지를 반환한다. 
            {
                _response.Result = new LoginResponseDTO();
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Username or password is incorrect");
                return BadRequest(_response);
            }


            //JWT Token 생성하기
            var roles = await _userManager.GetRolesAsync(userFromDb); //role에 대한 목록을 db에서 가져와 검색할 수 있다. (비동기) 
            JwtSecurityTokenHandler tokenHandler = new(); //토큰 생성 핸들러 객체 생성하기 
            byte[] key = Encoding.ASCII.GetBytes(secretKey); //비밀 키 저장소를 바이트 배열로 변환하여 저장한다. 

             SecurityTokenDescriptor tokenDescriptor = new() //토큰 설명 객체에 토큰에서 원하는 모든 세부 사항이 무엇인지 정의한다. 
             {
                 Subject = new ClaimsIdentity(new Claim[]
                 {
                     new Claim("fullName", userFromDb.Name),
                     new Claim("id", userFromDb.Id.ToString()),
                     new Claim(ClaimTypes.Email, userFromDb.UserName.ToString()), //전세계적으로 사용되는 이메일 롤은 유형이 내장되어있다. 
					 new Claim(ClaimTypes.Role, roles.FirstOrDefault()), //이것도 사용자 지정 클레임, 현재는 하나의 역할만 갖기 때문에 .으로 기본값 지정이지만 여려 역할인경우 배열 또는 ,로 전달한다. 
				 }),
                 Expires = DateTime.UtcNow.AddDays(7), //토큰 유효기간을 7일후 만료임을 설정한다. 
                 SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                 //마지막으로 키를 사용하여 토큰에 서명을 검증하거나 추가해야한다. 토근 설명자 생성 시 바이트 배열과 보안알고리즘을 전달한다.
             };

            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
            //토큰이 동일하므로 토큰 핸들러를 사용하여 토큰설명자를 기반으로 보안토큰을 생성한다. 



            LoginResponseDTO loginResponse = new()
            {
                Email = userFromDb.Email,
                ToKen = tokenHandler.WriteToken(token)
            };

            if (loginResponse.Email == null || string.IsNullOrEmpty(loginResponse.ToKen))
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Username or password is incorrect");
                return BadRequest(_response);
            }
            _response.StatusCode = HttpStatusCode.OK;
            _response.IsSuccess = true;
            _response.Result = loginResponse;
            return Ok(_response);
        }


        [HttpPost("register")] //이 엔드포인내에서 사용자를 등록하거나 생성해야 합니다. 
        public async Task<IActionResult> Register([FromBody] RegisterRequestDTO model)
        {
            ApplicationUser userFromDb = _db.ApplicationUsers
                .FirstOrDefault(u => u.UserName.ToLower() == model.UserName.ToLower()); //응용프로그램 관리자 //애플리케이션 사용자에 액세스하여 동일한 이름이 존재하는지 확인한다. 

            if (userFromDb != null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                _response.ErrorMessages.Add("Username already exists");
                return BadRequest(_response); //잘못된 요청에 대한 응답 메시지 
            }

            ApplicationUser newUser = new()
            {
                UserName = model.UserName,
                Email = model.UserName,
                NormalizedEmail = model.UserName.ToUpper(),
                Name = model.Name
            };

            try
            {
                var result = await _userManager.CreateAsync(newUser, model.Password);
                //사용자 관리자에 대한 대기 시간과 동일한 변수 결과를 얻는 것, 전달값은 새로운 사용자와 비밀번호
                if (result.Succeeded)       //결과를 얻으면 성공 확인할 수 있다.
                {
                    if (!_roleManager.RoleExistsAsync(SD.Role_Admin).GetAwaiter().GetResult()) //비동기식 메서드 RoleExistsAsync (using문을 추가하여 role이 존재하는지 여부 확인)
                    {
                        //역할role이 없는 경우 db에서 관리자 및 고객 role을 생성한다.
                        await _roleManager.CreateAsync(new IdentityRole(SD.Role_Admin));
                        await _roleManager.CreateAsync(new IdentityRole(SD.Role_Customer));
                    }
                    if (model.Role.ToLower() == SD.Role_Admin) //관리자를 선택하는 경우 관리자 권한을 부여한다. 
                    {
                        await _userManager.AddToRoleAsync(newUser, SD.Role_Admin);

                    }
                    else //관리자 외에는 고객의 권한을 부여한다. 
                    {
                        await _userManager.AddToRoleAsync(newUser, SD.Role_Customer);

                    }
                    //모든 조건이 성공했을 때 반환값
                    _response.StatusCode = HttpStatusCode.OK;
                    _response.IsSuccess = true;
                    return Ok(_response);
                }
            }
            catch (Exception)
            {

            }
            //실패 시 잘못된 요청과 오류 반환
            _response.StatusCode = HttpStatusCode.BadRequest;
            _response.IsSuccess = false;
            _response.ErrorMessages.Add("Error while registering");
            return BadRequest(_response);
        }
    }
}
