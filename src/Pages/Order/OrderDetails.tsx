//주문 세부정보 페이지 
import React from "react";
import { useParams } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../../Apis/orderApi";
import { OrderSummary } from "../../Components/Page/Order";


function OrderDetails(){
    const {id} = useParams(); //매개변수를 사용하여 해당 ID 검색  
    const {data, isLoading} = useGetOrderDetailsQuery(id);
    let userInput, orderDetails; //사용자입력, 주문상세정보  

    if (!isLoading && data?.result) //로딩이 끝났을 때 빈 데이터가 아닌지 확인
        {
            console.log(data.result);
            userInput = {
                name: data.result[0].pickupName,
                email: data.result[0].pickupEmail,
                phoneNumber: data.result[0].pickupPhoneNumber,
            };
            orderDetails = {
                id: data.result[0].orderHeaderId,
                cartItems: data.result[0].orderDetails,
                cartTotal: data.result[0].orderTotal,
                status: data.result[0].status,
            }
        }

    return(
        <div
            className="container my-5 mx-auto p-5 w-100"
            style={{ maxWidth: "750px" }}>

        {!isLoading && orderDetails && userInput && (
            <OrderSummary data={orderDetails} userInput={userInput}/>
        )} 
        </div>
    );
}
export default OrderDetails;