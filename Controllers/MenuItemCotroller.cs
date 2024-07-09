using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using RedMango_API.Data;
using RedMango_API.Migrations.Models;
using RedMango_API.Migrations.Models.Dto;
using RedMango_API.Migrations.Services;
using RedMango_API.Migrations.Utility;
using System.Net;

namespace RedMango_API.Controllers
{
	[Route("api/MenuItem")]
	[ApiController]
	public class MenuItemController : ControllerBase
	{ //db 읽어오기 
		private readonly ApplicationDbContext _db;
        private readonly IBlobService _blobService;
        private ApiResponse _response; //추가
        public MenuItemController(ApplicationDbContext db, IBlobService blobService) //변경
        {
			_db = db;
            _blobService = blobService;
            _response = new ApiResponse(); //추가
        }
		[HttpGet] //엔드포인트 
		public async Task<IActionResult> GetMunuItems()
		{
            _response.Result = _db.MenuItems; //추기
            _response.StatusCode = HttpStatusCode.OK; //추가
            return Ok(_response); //변경
        }

        [HttpGet("{id:int}", Name = "GetMenuItem")] //개별항목 엔드포인트 추가 _ 구분할 수 있도록 int로 받음을 표시해준다. 
        public async Task<IActionResult> GetMunuItem(int id)
        {
            if (id == 0)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                //_response.IsSuccess = false;
                return BadRequest(_response);
            }
            MenuItem menuItem = _db.MenuItems.FirstOrDefault(u => u.Id == id);
            if (menuItem == null)
            {
                _response.StatusCode = HttpStatusCode.NotFound;
                return NotFound(_response);
            }
            _response.Result = _db.MenuItems; //추기
            _response.StatusCode = HttpStatusCode.OK; //추가
            return Ok(_response); //변경
        }

        [HttpPost] //create menuItem
        [Authorize(Roles = SD.Role_Admin)] //관리자 역할을 가진 사용자만 메뉴 항목 생성 
        public async Task<ActionResult<ApiResponse>> CreateMenuItem([FromForm] MenuItemCreateDTO menuItemCreateDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (menuItemCreateDTO.File == null || menuItemCreateDTO.File.Length == 0)
                    {
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        _response.IsSuccess = false;
                        return BadRequest(); //생성 시 이미지 파일 없으면 오류 
                    }
                    string fileName = $"{Guid.NewGuid()}{Path.GetExtension(menuItemCreateDTO.File.FileName)}"; //추가
                   MenuItem menuItemToCreate = new()
                            {
                                Name = menuItemCreateDTO.Name,
                                Price = menuItemCreateDTO.Price,
                                Category = menuItemCreateDTO.Category,
                                SpecialTag = menuItemCreateDTO.SpetialTag,
                                Description = menuItemCreateDTO.Descripition,
                                Image = await _blobService.UploadBlob(fileName, SD.SD_Storage_Container, menuItemCreateDTO.File)
                                //Image를 사용하려면 종속성 주입에 I blob 서비스를 주입해야한다. 
                                //파일이름은 기존걸 사용해도 되고 그룹을 만들어도 된다.

                            };
                    _db.MenuItems.Add(menuItemToCreate); //db에 생성한 항목 저장하기 
                    _db.SaveChanges();
                    _response.Result = menuItemToCreate;
                    _response.StatusCode = HttpStatusCode.Created;
                    return CreatedAtRoute("GetMenuItem", new { id = menuItemToCreate.Id }, _response);
                }
                else //모델 상태가 유효하지 않을 때 
                {
                    _response.IsSuccess = false;
                }
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages
                    = new List<string>() { ex.ToString() };
            }
            return _response;
        }


        [HttpPut("{id:int}")] //update menuItem 
        public async Task<ActionResult<ApiResponse>> UdateMenuItem(int id, [FromForm] MenuItemUpdateDTO menuItemUpdateDTO)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    if (menuItemUpdateDTO == null || id != menuItemUpdateDTO.Id)
                    {
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        _response.IsSuccess = false;
                        return BadRequest(); //매개변수의 id가 업뎃 dto내부 id와 일치하지 않으면 잘못된 요청
                    }

                    MenuItem menuItemFromDb = await _db.MenuItems.FindAsync(id);
                    if (menuItemFromDb == null)
                    {
                        _response.StatusCode = HttpStatusCode.BadRequest;
                        _response.IsSuccess = false;
                        return BadRequest();
                    }
                    menuItemFromDb.Name = menuItemUpdateDTO.Name;   
                    menuItemFromDb.Price = menuItemUpdateDTO.Price;
                    menuItemFromDb.Category = menuItemUpdateDTO.Category;
                    menuItemFromDb.SpecialTag = menuItemUpdateDTO.SpecialTag;
                    menuItemFromDb.Description = menuItemUpdateDTO.Description;

                    if (menuItemUpdateDTO.File != null && menuItemUpdateDTO.File.Length > 0)
                    { // if 파일이 있는 상태라면 이전 파일 지우기 delete 
                        string fileName = $"{Guid.NewGuid()}{Path.GetExtension(menuItemUpdateDTO.File.FileName)}";

                        await _blobService.DeleteBlob(menuItemFromDb.Image.Split('/').Last(), SD.SD_Storage_Container);
                        //이미지 경로는 /로 분할되며 /다음의 마지막 값이 필요하다, SD컨테이너에 저장된 이미지들 
                        menuItemFromDb.Image = await _blobService.UploadBlob(fileName, SD.SD_Storage_Container, menuItemUpdateDTO.File);
                    }


                    _db.MenuItems.Update(menuItemFromDb); //db에 생성한 항목 저장하기 
                    _db.SaveChanges();
                    _response.StatusCode = HttpStatusCode.NoContent;
                    return Ok(_response);
                }
                else //모델 상태가 유효하지 않을 때 
                {
                    _response.IsSuccess = false;
                }
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages
                     = new List<string>() { ex.ToString() };
            }
            return _response;
        }
        [Authorize(Roles = SD.Role_Admin)]
        [HttpDelete("{id:int}")] //delete menuItem
        public async Task<ActionResult<ApiResponse>> DeleteMenuItem(int id)
        {
            try
            {
                if (id == 0) //
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    return BadRequest();
                }

                MenuItem menuItemFromDb = await _db.MenuItems.FindAsync(id);
                if (menuItemFromDb == null)
                {
                    _response.StatusCode = HttpStatusCode.BadRequest;
                    _response.IsSuccess = false;
                    return BadRequest();
                }
                await _blobService.DeleteBlob(menuItemFromDb.Image.Split('/').Last(), SD.SD_Storage_Container);
                //blob을 삭제하면 메뉴 항목을 삭제할 수 있다. 
                int milliseconds = 2000;
                Thread.Sleep(milliseconds); //지연시간 2초 설정하기 (선택사항)

                _db.MenuItems.Remove(menuItemFromDb);
                _db.SaveChanges();
                _response.StatusCode = HttpStatusCode.NoContent;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages
                     = new List<string>() { ex.ToString() };
            }
            return _response;
        }
    }
}