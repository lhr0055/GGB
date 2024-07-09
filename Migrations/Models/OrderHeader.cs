using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace RedMango_API.Migrations.Models
{
    public class OrderHeader
    {
        [Key]
        public int OrderHeaderId { get; set; }
        [Required]
        public string PickupName { get; set; }
        [Required]
        public string PickupPhoneNumber { get; set; }
        [Required]
        public string PickupEmail { get; set; }

        public string ApplicationUserId { get; set; } //외래키 
        [ForeignKey("ApplicationUserId")] //외래키를 사용하여 사용자의 탐색 속성을 추가하고 관계를 정의 
        public ApplicationUser User { get; set; }
        public double OrderTotal { get; set; }

        public DateTime OrderDate { get; set; }
        public string StripePaymentIntentID { get; set; }
        public string Status { get; set; }
        public int TotalItems { get; set; }
        public IEnumerable<OrderDetails> OrderDetails { get; set; }
    }
}
