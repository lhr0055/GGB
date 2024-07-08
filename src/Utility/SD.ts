export enum SD_Roles{
    ADMIN = "admin",
    CUSTOMER = "customer",
}
export enum SD_Status {
    PENDING = "Pending",
    CONFIRMED= "Confirmed",
    BEING_COOKED = "Being Cooked",
    READY_FOR_PICKUP = "Ready for Pickup", 
    COMPLETED = "Completed",
    CANCELLED = "Cancelld",
}

export enum SD_Categories{
    CABBAGE_KIMCHI = "Cabbage",
    RADISH_KIMCHI = "Radish",
    // GREEN_ONION_KIMCHI = "Green Onion",
    // CUCUMBER_KIMCHI = "Cucumber",
    OTHER_KIMCHI = "Other",
    DISH = "Dish",
}

export enum SD_SortTypes {
    PRICE_LOW_HIGH = "Price Low - High",
    PRICE_HIGH_LOW = "Price High - Low",
    NAME_A_Z = "Name A - Z",
    NAME_Z_A = "Name Z - A",
}
//열거형으로 두가지 역할을 정의하여 register에서 value값으로 넣어준다.