using System.ComponentModel.DataAnnotations.Schema;

namespace RedMango_API.Migrations.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public int MenuItemId { get; set; } //메뉴의 id항목 가져오기
        [ForeignKey("MenuItemId")] //외래키 추가하여 위아래 두 테이블이 연결된다. 
        public MenuItem MenuItem { get; set; } = new();
        public int Quantity { get; set; } //사용자가 주문하려는 수량
        public int ShoppingCartId { get; set; }
    }
}
