import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetMenuItemByIdQuery } from "../Apis/menuItemApi";
import { useUpdateShoppingCartMutation } from "../Apis/shoppingCartApi";
import { MainLoader, MiniLoader } from "../Components/Page/Common";
import { apiResponse } from "../Interfaces";
import { toastNotify } from "../Helper";
import userModel from "../Interfaces/userModel";
import { RootState } from "../Storage/Redux/store";
import { useSelector } from "react-redux";
//USER ID - b7ae37bf-09b1-4b47-9ce1-c963031d2920

function MenuItemDetails(){

    const{menuItemId} = useParams();
    //App.tsx에서 정의한 : menuItemId 변수이름과 일치해야한다. 
    const {data, isLoading} = useGetMenuItemByIdQuery(menuItemId);
    // console.log(data); //세부정보 데이터 
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1); //수량 상태 추적하기 
    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
    const [updateShoppingCart] = useUpdateShoppingCartMutation(); //업데이트 호출 시 세개의 매개변수 전달 
    const userData: userModel = useSelector(
      (state: RootState) => state.userAuthStore
    );
  
    
    const handleQuantity = (counter: number)=>{
      let newQuantity = quantity + counter;
      if (newQuantity == 0) {
        newQuantity = 1; //수량이 0보다 작아져도 1로 유지한다. 
      }
      setQuantity(newQuantity);
      return;
    };

    //세부항목에서 로그인 안된 채 장바구니에 넣으려하면 로그인으로 이동 
    const handleAddToCart = async (menuItemId: number) => {
      if(!userData.id){
        navigate("/login");
        return;
      }
      setIsAddingToCart(true);

      const response : apiResponse = await updateShoppingCart({
        menuItemId: menuItemId,
        updateQuantityBy: quantity,
        // userId: "b7ae37bf-09b1-4b47-9ce1-c963031d2920",
        userId: userData.id,
      });

      if(response.data && response.data.isSuccess){
        toastNotify("Item added to cart successfully!");
      }
    // console.log(response);
    setIsAddingToCart(false);
  };

  
    
    return(
          <div className="container pt-4 pt-md-5">
            {!isLoading ? ( //로드되지않는경우 세부정보 표시 
            <div className="row">
            <div className="col-7">
              <h2 className="SF_HambakSnow">{data.result?.name}</h2>
              <span>
                <span
                  className="badge text-bg-dark pt-2"
                  style={{ height: "40px", fontSize: "20px" }}>
                  {data.result?.category}
                </span>
              </span>
              <span>
                <span
                  className="badge text-bg-light pt-2"
                  style={{ height: "40px", fontSize: "20px" }}>
                    {data.result?.specialtag}
                </span>
              </span>
              <p style={{ fontSize: "20px" }} className="pt-2">
                {data.result?.description}
              </p>
              <span className="h3">{data.result?.price}원</span> &nbsp;&nbsp;&nbsp;
              <span
                className="pb-2  p-3"
                style={{ border: "1px solid #333", borderRadius: "30px" }}
              >
                <i onClick={()=>{
                  handleQuantity(-1); //수량 -1
                }}
                  className="bi bi-dash p-1"
                  style={{ fontSize: "25px", cursor: "pointer" }}>
                </i>
                <span className="h3 mt-3 px-3">{quantity}</span>
                <i onClick={()=>{
                  handleQuantity(+1); //수량 +1
                }}
                  className="bi bi-plus p-1"
                  style={{ fontSize: "25px", cursor: "pointer" }}>
                </i>
              </span>
              <div className="row pt-4">
                <div className="col-5">
                  {isAddingToCart ? ( //상태를 확인하여 로더 표시하기 
                    <button disabled className="btn btn-success form-cointrol">
                      <MiniLoader/> 
                      {/*  < size={50}/> 매개변수 전달하여 크기를 지정할 수 있다 */}
                    </button>
                  ) : (
                    <button className="btn btn-success form-control"
                    onClick={()=>
                      handleAddToCart(data.result?.id) //메뉴항목id 가져오기
                    }>
                    Add to Cart
                  </button>
                  )}
                </div>
    
                <div className="col-5 ">
                  <button 
                    className="btn btn-secondary form-control"
                    onClick={()=>navigate(-1)}> 
                    {/* -1은 마지막으로 접속했던 url로 이동 */}
                      Back to Home
                  </button>
                </div>
              </div>
            </div>
            <div className="col-5">
              <img
                src={data.result.image}
                width="100%"
                style={{ borderRadius: "50%" }}
                alt="No content"
              ></img>
            </div>
          </div>
          ) : (<div 
                className = "d-flex justify-content-center"
                style={{width: "100%"}}
              >
                <MainLoader/>
              </div>
            )}
          </div>
        );
}

export default MenuItemDetails;