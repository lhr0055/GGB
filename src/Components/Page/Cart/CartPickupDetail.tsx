import React, { useEffect, useState } from "react";
import { RootState } from "../../../Storage/Redux/store";
import { useSelector } from "react-redux";
import { apiResponse, cartItemModel } from "../../../Interfaces";
import { inputHelper } from "../../../Helper";
import { MiniLoader } from "../Common";
import { useInitiatePaymentMutation } from "../../../Apis/paymentApi";
import { useNavigate } from "react-router-dom";

export default function CartPickupDetails(){
    const[loading, setLoading] = useState(false); //결제 시 미니 로딩 구현
    const shoppingCartFromStore: cartItemModel[] = useSelector(
        (state : RootState) => state.shoppingCartStore.cartItems ?? []
        //Store.ts에서의 type
    );
    //결제 정보란에 (pickup Detail) 사용자 정보를 가져온다. 
    const userData = useSelector((state: RootState) => state.userAuthStore);

    let grandTotal = 0;
    let totalItems = 0;
    const initialUserData = { //초기화 => 입력필드에서 입력받기 
        name: userData.fullName, //근데 입력 안됨 
        email: userData.email,
        phoneNumber: "",
    };

    //장바구니의 항목이 있는 경우 매핑하기, 사용자 입력 값 전달하기 
    shoppingCartFromStore?.map((cartItem: cartItemModel)=>{
        totalItems += cartItem.quantity?? 0;
        grandTotal += (cartItem.menuItem?.price?? 0) * (cartItem.quantity?? 0);
        return null;
    });
    
    const navigate = useNavigate();
    const [userInput, setUserInput] = useState(initialUserData);
    const [initatePayment] = useInitiatePaymentMutation(); //결제 api 받아오기 
    const handlerUserInput = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const tempData = inputHelper(e, userInput);
        setUserInput(tempData);
    }

    useEffect(() => {
      setUserInput({
        name: userData.fullName,
        email: userData.email,
        phoneNumber: "",
      });
    }, [userData]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        //로딩 플래그를 true로 설정한 후 결제 시작을 호출한다. 
        const {data} : apiResponse = await initatePayment(userData.id) //api 응답 데이터 비동기로 검색

        // const orderSummary = { grandTotal, totalItems };
        navigate("/payment",{
          state: { apiResult: data?.result, userInput },
        });
    };

    return(
        <div className="border pb-5 pt-3">
        <h1 style={{ fontWeight: "300", color: "#000080"}} className="text-center">
          Pickup Details
        </h1>
        <hr /> 
        {/* 버튼 누르면 이벤트 발생  */}
        <form onSubmit={handleSubmit} className="col-10 mx-auto">
          <div className="form-group mt-3">
            Pickup Name
            <input
              type="text"
              value={userInput.name}
              className="form-control"
              placeholder="name..."
              onChange={handlerUserInput}
              name = "name"
              required
            />
          </div>
          <div className="form-group mt-3">
            Pickup Email
            <input
              type="email"
              value={userInput.email}
              className="form-control"
              placeholder="email..."
              onChange={handlerUserInput}
              name = "email"
              required
            />
          </div>
  
          <div className="form-group mt-3">
            Pickup Phone Number
            <input
              type="number"
              value={userInput.phoneNumber}
              className="form-control"
              placeholder="phone number..."
              onChange={handlerUserInput}
              name = "phoneNumber"
              required
            />
          </div>
          <div className="form-group mt-3">
            <div className="card p-3" style={{ background: "ghostwhite" }}>
              <h5>Grand Total : {grandTotal.toFixed(0)}원</h5>
              <h5>No of items : {totalItems}</h5>
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-lg form-control mt-3" style={{backgroundImage: "linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet)", fontWeight:"bold", color:"white"}}
            disabled={loading || shoppingCartFromStore.length == 0} //로딩중으로 상태 변환한다. 
          >
            {loading ? <MiniLoader /> : "Looks Good? Place Order!" }
          </button>
        </form>
      </div>
    )
}