import React from "react";
import OrderListProps from "./orderListType";
import { MainLoader } from "../Common";
import { orderHeaderModel } from "../../../Interfaces";
import { useNavigate } from "react-router-dom";
import { getStatusColor } from "../../../Helper";

function OrderList({isLoading, orderData}: OrderListProps) {
    const navigate = useNavigate();

    return(
      <>
      {isLoading && <MainLoader/>} 
      {!isLoading && (
        <div className="table px-5">
        <div className="p-2">
          <div className="row border">
            <div className="col-1">ID</div>
            <div className="col-2">이름</div>
            <div className="col-2">휴대폰</div>
            <div className="col-1">결제금액</div>
            <div className="col-1">결제수량</div>
            <div className="col-2">주문일</div>
            <div className="col-2">주문상태</div>
            <div className="col-1"></div>
          </div>
          {/* 아이템 개수만큼 반복하기 */}
          {orderData.map((orderItem: orderHeaderModel)=>{
            const badgeColor = getStatusColor(orderItem.status!);

            return(
              <div className="row border" key={orderItem.orderHeaderId}>
                <div className="col-1"> {orderItem.orderHeaderId} </div>
                <div className="col-2"> {orderItem.pickupName} </div>
                <div className="col-2"> {orderItem.pickupPhoneNumber} </div>
                <div className="col-1">
                  {orderItem.orderTotal!.toFixed(0)}원
                </div>
                <div className="col-1"> {orderItem.totalItems} </div>
                <div className="col-2">
                  {new Date(orderItem.orderDate!).toLocaleDateString()}
                </div>
                <div className="col-2">
                    <span className={`badge bg-${badgeColor}`}>
                      {orderItem.status}
                    </span>
                </div>
                <div className="col-1">
                  <button 
                    className="btn btn-outline-success"
                    onClick={()=>
                        navigate(
                            "/order/orderDetails/" + orderItem.orderHeaderId
                        )
                    }>
                    Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}
      </>
    );
}

export default OrderList;