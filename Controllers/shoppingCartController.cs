using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RedMango_API.Data;
using RedMango_API.Migrations.Models;
using System.Net;

namespace RedMango_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShoppingCartController : ControllerBase
    {
        protected ApiResponse _response;
        private readonly ApplicationDbContext _db;
        public ShoppingCartController(ApplicationDbContext db) //db에 액세스하기 위해 애플리케이션 유형 context 추가 
        {
            _response = new();
            _db = db;
        }


        [HttpGet]
        public async Task<ActionResult<ApiResponse>> GetShoppingCart(string userId)
        {
            try
            {
                ShoppingCart shoppingCart; //여기서부터 변경사항 
                if (string.IsNullOrEmpty(userId)) //사용자 ID가 비어있거나 null인 경우 빈 장바구니 반환 
                {
                    shoppingCart = new();
                }
                else //그렇지 않으면 채워진 장바구니 반환 
                {
                    shoppingCart = _db.ShoppingCarts
                    .Include(u => u.CartItems).ThenInclude(u => u.MenuItem)
                    .FirstOrDefault(u => u.UserId == userId);
   
                } //여기까지  (Redux를 사용할 때 다른 접근 방식을 사용하기 때문) 
                if (shoppingCart.CartItems != null && shoppingCart.CartItems.Count > 0){ //장바구니 항목이 있는 경우 
                    shoppingCart.CartTotal = shoppingCart.CartItems.Sum(u => u.Quantity * u.MenuItem.Price);//수량 * 가격의 합 총액 계산 
                }
                _response.Result = shoppingCart;
                _response.StatusCode = HttpStatusCode.OK;
                return Ok(_response);
            }
            catch (Exception ex)
            {
                _response.IsSuccess = false;
                _response.ErrorMessages
                         = new List<string>() { ex.ToString() };
                _response.StatusCode = HttpStatusCode.BadRequest;
            }
            return _response;
        }



        [HttpPost]
        public async Task<ActionResult<ApiResponse>> AddOrUpdateItemInCart(string userId, int menuItemId, int updateQuantityBy)
        //API응답 유형의 작업 결과이며 CART의 항목 추가 또는 없데이트 호출 (사용자의 장바구니를 확인하기 위한 사용자 id, 업데이트에 추가하려는 메뉴 항목 id, 메뉴항목 업데이트 카운터)
        {
            //사용자 id로 장바구니 검색하기 
            ShoppingCart shoppingCart = _db.ShoppingCarts.Include(u=>u.CartItems).FirstOrDefault(u => u.UserId == userId);
            MenuItem menuItem = _db.MenuItems.FirstOrDefault(u => u.Id == menuItemId);
            if (menuItem == null)
            {
                _response.StatusCode = HttpStatusCode.BadRequest;
                _response.IsSuccess = false;
                return BadRequest(_response);

            }
            if (shoppingCart == null && updateQuantityBy > 0)
            {
                ShoppingCart newCart = new() { UserId = userId };
                _db.ShoppingCarts.Add(newCart);
                _db.SaveChanges();

                CartItem newCartItem = new()
                {
                    MenuItemId = menuItemId,
                    Quantity = updateQuantityBy,
                    ShoppingCartId = newCart.Id,
                    MenuItem = null //외래키로 작업할 때 메뉴 항목은 탐색속성이므로 null값 (안그럼 새 메뉴 항목을 만들려 시도함) 
                };
                _db.CartItems.Add(newCartItem);
                _db.SaveChanges();
            }
            else
            {
                CartItem cartItemInCart = shoppingCart.CartItems.FirstOrDefault(u => u.MenuItemId == menuItemId);
                //카트 아이템을 확인하고 카트가 비어있는지 확인한다. 
                if (cartItemInCart == null)
                {
                    CartItem newCartItem = new()  //비어있으면 아이템을 새장바구니에 추가하고 추가된 내용을 업뎃한다. 
                    {
                        MenuItemId = menuItemId,
                        Quantity = updateQuantityBy,
                        ShoppingCartId = shoppingCart.Id,
                        MenuItem = null
                    };
                    _db.CartItems.Add(newCartItem);
                    _db.SaveChanges();
                }
                else //장바구니에 이미 품목이 있으면 수량을 업데이트 한다. 
                {
                    int newQuantity = cartItemInCart.Quantity + updateQuantityBy;
                    if (updateQuantityBy == 0 || newQuantity <= 0)  //수량을 0미만으로 제거하는 경우 항목을 삭제하고 장바구니가 비어있다면 장바구니도 제거한다. 
                    {
                        _db.CartItems.Remove(cartItemInCart);
                        if (shoppingCart.CartItems.Count() == 1)
                        {
                            _db.ShoppingCarts.Remove(shoppingCart);
                        }
                        _db.SaveChanges();
                    }
                    else //1이상인 경우 수량 변화에 대해 업데이트 
                    {
                        cartItemInCart.Quantity = newQuantity;
                        _db.SaveChanges();
                    }
                }
            }
            return _response;
        }
    }
}
