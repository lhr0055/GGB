using System.ComponentModel.DataAnnotations;

namespace RedMango_API.Migrations.Models.Dto
{
    public class MenuItemCreateDTO
    {
        [Required] //필수사항
		public string Name { get; set; }
        public string Descripition { get; set; }
        public string SpetialTag { get; set; }
        public string Category { get; set; }
		[Range(1, int.MaxValue)] // 시작, 끝
		public double Price { get; set; }
        public IFormFile File { get; set; }
    }
}
