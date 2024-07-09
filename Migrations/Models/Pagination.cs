namespace RedMango_API.Migrations.Models
{
    public class Pagination
    {
        public int CurrentPage { get; set; } //현재 페이지
        public int PageSize { get; set; } //페이지 크기 
        public int TotalRecords { get; set; } // 총 페이지 
    }
}
