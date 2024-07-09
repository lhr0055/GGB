import React from "react";
import { orderSummaryProps } from "./orderSummaryProps";
import { cartItemModel } from "../../../Interfaces";
import { getStatusColor } from "../../../Helper";
import { useNavigate } from "react-router-dom";
import { SD_Roles, SD_Status } from "../../../Utility/SD";
import { useSelector } from "react-redux";
import { RootState } from "../../../Storage/Redux/store";
import { useState } from "react";
import { useUpdateOrderHeaderMutation } from "../../../Apis/orderApi";
import { MainLoader } from "../Common";

function OrderSummary({ data, userInput }: orderSummaryProps) {
    //주문 새부정보에 표시할 상태 색상 표시하기를 상수로 가져옴 
    const badgeTypeColor = getStatusColor(data.status!);
    const navigate = useNavigate();
    const userData = useSelector((state: RootState)=>state.userAuthStore);
    const[loading, setIsLoading] = useState(false);
    const [updateOrderHeader] = useUpdateOrderHeaderMutation();

    //현재 상태와 비교하여 다음 상태 나타내기 
    const nextStatus: any = 
      data.status! === SD_Status.CONFIRMED
      ? {color:"info", value: SD_Status.PREPARING}
      : data.status! === SD_Status.PREPARING
      ? {color:"warning", value: SD_Status.SHIPPING}
      : data.status! === SD_Status.SHIPPING && {
        color: "success",
        value: SD_Status.COMPLETED,
      };

      const handleNextStatus = async() => {
        setIsLoading(true);
        // console.log(data);
        await updateOrderHeader({
          orderHeaderId: data.id,
          status: nextStatus.value,
        })
        setIsLoading(false);
      };
      const handleCancel = async() => {
        setIsLoading(true);
        await updateOrderHeader({
          orderHeaderId: data.id,
          status: SD_Status.CANCELLED,
        });
        setIsLoading(false);
      };

    return(
      <div>
      {loading && <MainLoader />}
      {!loading && (  
      <>
      <div className="d-flex justify-content-between aling-items-center">
        <h3 className="text-success">Order Summary</h3> 
        <span className={`btn btn-outline-${badgeTypeColor} fs-6`}>
          {data.status}
        </span>
      </div>

      <div className="mt-3"> 
        {/* userInput => ordersummary props */}
        <div className="border py-3 px-2">Name : {userInput.name} </div> 
        <div className="border py-3 px-2">Email : {userInput.email} </div>
        <div className="border py-3 px-2">Phone : {userInput.phoneNumber} </div>
        <div className="border py-3 px-2">
        <h4 className="text-success">Menu Items</h4>
        <div className="p-3">
            {data.cartItems?.map((cartItem: cartItemModel, index: number) => {
                return (
                  <div className="d-flex" key={index}>
                    <div className="d-flex w-100 justify-content-between">
                        <p> {cartItem.menuItem?.name} </p>
                        <p> {cartItem.menuItem?.price} x {cartItem.quantity} =</p>
                    </div>
                    <p style={{ width: "70px", textAlign: "right" }}>
                       {(cartItem.menuItem?.price ?? 0) * (cartItem.quantity ?? 0)}원
                    </p>
                </div>
                );
            })}
          
            
            <hr />
            <h4 className="text-danger" style={{ textAlign: "right" }}>
               {data.cartTotal?.toFixed(0)}원
            </h4>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <button 
            className="btn btn-secondary"
            onClick={()=>navigate(-1)}
          > Back to Orders
          </button>
          {userData.role == SD_Roles.ADMIN && ( //관리자인 경우에만 상태 바꿀 수 있음 
            <div className="d-flex">
              {data.status! !== SD_Status.CANCELLED && 
               data.status! !== SD_Status.CONFIRMED && ( //취소아니고 완료아니면 취소버튼 표시 
                <button 
                  className="btn btn-danger mx-2" 
                  onClick={handleCancel}> Cancel 
                </button>
               )}
              
              <button className={`btn btn-${nextStatus.color}`}
                onClick={handleNextStatus}>
                {nextStatus.value}
              </button>
            </div>
          )}
        </div>
        </>
        )}
      </div>
    );
}

export default OrderSummary;