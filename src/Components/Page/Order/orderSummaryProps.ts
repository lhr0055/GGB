import { shoppingCartModel } from "../../../Interfaces";
import { SD_Status } from "../../../Utility/SD";

export interface orderSummaryProps{
    data: {
        id?: number;
        cartItems?: shoppingCartModel[];
        cartTotal?: number;
        userId?:string;
        stripePaymentIntentId?: string;
        status?: SD_Status;
    };
    userInput: {
        name: string;
        email: string;
        phoneNumber: string;
    }; //결제에 필요한 사용자의 정보 
}

//이것이 타입이 됨