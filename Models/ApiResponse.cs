using System.Net;
// 여기에서 응답값들을 지정한다.
namespace RedKimchi_API.Models
{
    public class ApiResponse
    {
        public ApiResponse()
        {
            ErrorMessages = new List<string>();
        }
        public HttpStatusCode StatusCode { get; set; }
        public bool IsSuccess { get; set; } = true;
        public List<string> ErrorMessages { get; set; }
        // 타입 모르기 때문에 object로 받는다.
        public object Result { get; set; }
    }
}
