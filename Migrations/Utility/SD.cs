namespace RedMango_API.Migrations.Utility
{
    public static class SD
    {
        public const string SD_Storage_Container = "redmango";
        //mango를 읽는 SD 저장소 컨테이너 호출에 대한 상수 추가 
        public const string Role_Admin = "admin";
        public const string Role_Customer = "customer";
        //주문 상태 
        public const string status_pending = "Pending"; //처음에는 보류 상태 
        public const string status_confirmed = "Confirmed"; //결제가 완료되면 확인 
        public const string status_beingCooked = "Being Cooked";
        public const string status_readyForPickUp = "Ready for Pickup";
        public const string status_Completed = "Completed";
        public const string status_Cancelled = "Cancelled"; //주문 취소가 가능하다. 
    }
}
