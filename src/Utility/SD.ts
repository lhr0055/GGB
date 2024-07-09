export enum SD_Roles{
    ADMIN = "admin",
    CUSTOMER = "customer",
}
export enum SD_Status {
    PAYMENT = "결제완료",
    CONFIRMED= "주문확인",
    PREPARING = "상품준비중",
    SHIPPING = "배송중", 
    COMPLETED = "배송완료",
    CANCELLED = "취소",
}

export enum SD_Categories{
    CABBAGE_KIMCHI = "배추김치류",
    RADISH_KIMCHI = "무김치류",
    OTHER_KIMCHI = "기타김치류",
    DISH = "밀키트",
}

export enum SD_SortTypes {
    PRICE_LOW_HIGH = "낮은가격순",
    PRICE_HIGH_LOW = "높은가격순",
    NAME_A_Z = "ㄱ-ㅎ",
    NAME_Z_A = "ㅎ-ㄱ",
}
//열거형으로 두가지 역할을 정의하여 register에서 value값으로 넣어준다.