import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { cartItemModel, userModel } from "../../../Interfaces";
import { RootState } from "../../../Storage/Redux/store";
import { useUpdateShoppingCartMutation } from "../../../Apis/shoppingCartApi";
import { removeFromCart, updateQuantity } from "../../../Storage/Redux/shoppingCartSlice"

function CartSummary(){
    const dispatch = useDispatch();
    const [updateShoppingCart] = useUpdateShoppingCartMutation();
    const shoppingCartFromStore: cartItemModel[] = useSelector(
        (state : RootState) => state.shoppingCartStore.cartItems ?? []
        //Store.ts에서의 type
    );
    const userData: userModel = useSelector(
      (state: RootState) => state.userAuthStore
    ); //사용자 데이터 가져오기 

    //장바구니에서 선택된 항목 상태 
    const [selectedItems, setSelectItems] = useState(
      shoppingCartFromStore.map(item => ({
        ...item, //체크된 항목만 새로 매핑하기 
        isChecked: true,
      }))
    )
    
    if (shoppingCartFromStore.length == 0) {
      return (
        <div className="p-5">
          There are no items in your cart. Please add items to continue.
        </div>
      );
    }

    const handleCheckboxChange = (id: number)=>{
      setSelectItems(prevItems => 
        prevItems.map(item => 
          item.menuItem?.id === id ? {...item, isChecked: !item.isChecked } : item
        )
      );
    };

    const handleQuantity = (
      updateQuantityBy: number, 
      cartItem: cartItemModel
    ) => {
      if(
        (updateQuantityBy == -1 && cartItem.quantity == 1) || 
        updateQuantityBy == 0){
        //아이템 지우기 
        updateShoppingCart({
          menuItemId: cartItem.menuItem?.id,
          updateQuantityBy: 0,
          userId: userData.id, //사용자 id 가져오기 
        });
        dispatch(removeFromCart({cartItem, quantity:0}));
      } else{
        //아이템 수량 업데이트
        updateShoppingCart({
          menuItemId: cartItem.menuItem?.id,
          updateQuantityBy: updateQuantityBy,
          userId: userData.id,
        });
        dispatch(
          updateQuantity({
            cartItem, 
            quantity: cartItem.quantity! + updateQuantityBy
    })
  );
}};


    return(
      <div className="container p-4 m-2">
        <h3 className="text-center text-dark BookkMyungjo-Bd">장바구니</h3>

        {/* 모든 장바구니 항목들 반복을 위한 매핑*/}
        {shoppingCartFromStore.map((
          cartItem : cartItemModel, index: number) =>
            <div
              key={index}
                className="d-flex flex-sm-row flex-column align-items-center custom-card-shadow rounded m-3"
                style={{ background: "white" }}>
              
                <div className="form-check ms-2">
                  <input 
                    className="form-check-input" 
                    type="checkbox" 
                    value="" 
                    id={`flexCheckDefault-${cartItem.menuItem?.id}`}
                    checked={cartItem.isChecked}
                    defaultChecked
                    style={{
                      border: cartItem.isChecked ? "solid 2px blue" : "solid 2px black"
                    }}/>
                  <label className="form-check-label" htmlFor="flexCheckDefault">
                    <div className="p-3">
                      <img
                        src={cartItem.menuItem?.image}
                        alt=""
                        width={"120px"}
                        className="rounded-circle"
                      />
                    </div>
                  </label>
                </div>

                <div className="p-2 mx-3" style={{ width: "100%" }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 style={{ fontWeight: 300 }}>{cartItem.menuItem?.name}</h4>
                    <button className="btn mx-1" onClick={()=>handleQuantity(0,cartItem)}>X</button>
                    {/* <h4>
                      {(cartItem.quantity! * cartItem.menuItem!.price).toFixed(0)}원
                    </h4> */}
                    {/* !는 타입스크립트의기본 주장 연산자?  */}
                  </div>
                  <div className="flex-fill">
                    <h4 className="text-danger">{cartItem.menuItem!.price}원</h4>
                  </div>
                  <div className="d-flex justify-content-between">
                    <div
                      className="d-flex justify-content-between p-2 mt-2 rounded-pill custom-card-shadow  "
                      style={{
                        width: "100px",
                        height: "43px",
                      }} 
                    >
                      <span style={{ color: "rgba(22,22,22,.7)" }} role="button">
                        <i className="bi bi-dash-circle-fill" onClick={()=>handleQuantity(-1,cartItem)}></i>
                      </span>
                      <span>
                        <b>{cartItem.quantity}</b>
                      </span>
                      <span style={{ color: "rgba(22,22,22,.7)" }} role="button">
                        <i className="bi bi-plus-circle-fill" onClick={()=>handleQuantity(1,cartItem)}></i>
                      </span>
                    </div>
                    <h4>
                      {(cartItem.quantity! * cartItem.menuItem!.price).toFixed(0)}원
                    </h4>
                    {/* <button className="btn mx-1" onClick={()=>handleQuantity(0,cartItem)}>X</button> */}
                  </div>
                </div>
              </div>
        )}
    </div>
    );
}
export default CartSummary;