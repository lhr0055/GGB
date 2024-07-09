using System.ComponentModel.DataAnnotations.Schema;
using System.Reflection.PortableExecutable;

namespace RedMango_API.Migrations.Models
{
    public class ShoppingCart
    {
        public int Id { get; set; }
        public string UserId { get; set; }  //userId에 문자열 사용하기 

        public ICollection<CartItem> CartItems { get; set; }

        [NotMapped] //매핑되지 않을 속성을 하나 더 추가한다. 기본적으로 속성이 모델에 있지만 추가되지는 않는다. _db 테이블에서도 제거된다. 
        public double CartTotal { get; set; } //카드 항목의 토탈 수량을 가져온다. 
        [NotMapped]
        public string StripePaymentIntentId { get; set; }
        [NotMapped]
        public string ClientSecret { get; set; }
    }
}
