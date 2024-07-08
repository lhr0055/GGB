import React, { useState } from "react";
import { apiResponse, menuItemModel, userModel } from "../../../Interfaces";
import { Link, useNavigate } from "react-router-dom";
import { useUpdateShoppingCartMutation } from "../../../Apis/shoppingCartApi";
import { MiniLoader } from "../Common";
import { toastNotify } from "../../../Helper";
import { useSelector } from "react-redux";
import { RootState } from "../../../Storage/Redux/store";

interface Props {
    menuItem: menuItemModel;
}

function MenuItemCard(props:Props){
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [updateShoppingCart] = useUpdateShoppingCartMutation();
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  );

  //장바구니 상태를 추적하여 추가 중이면 로딩 효과주기, 하나씩 추가하기
  const handleAddToCart = async (menuItemId: number) => {
    if(!userData.id){
      navigate("/login");
      return;
    }
    setIsAddingToCart(true);

    const response : apiResponse = await updateShoppingCart({
      menuItemId: menuItemId,
      updateQuantityBy: 1, //1씩 추가될 것
      // userId: "b7ae37bf-09b1-4b47-9ce1-c963031d2920",
      userId: userData.id,
    });
    if(response.data && response.data.isSucess){
      toastNotify("Item added to cart successfully!");
    }
    // console.log(response);
    setIsAddingToCart(false);
    // toastNotify("Item added to cart successfully!");
};
//addtocart를 눌렀을때 사용자 id가 있는지 확인하여 없으면 로그인 페이지로 이동한다. 


    return(
      <div className="col-md-4 col-12 p-4">
      <div
        className="card"
        style={{ boxShadow: "0 1px 7px 0 rgb(0 0 0 / 50%)" }}
      >
        <div className="card-body pt-2">
          <div className="row col-10 offset-1 p-4">
            <Link to={`/menuItemsDetails/${props.menuItem.id}`}>
            <img
              src={props.menuItem.image}
              style={{ 
                objectFit: "cover", //이미지 사이즈에 맞춰 
                borderRadius: "100%", 
                height:"200px",
                border:"1px solid lightgray"
              }}
              alt=""
              className="w-100 mt-5 image-box"
            />
            </Link>
          </div>
          {props.menuItem.specialTag &&
            props.menuItem.specialTag.length > 0 &&(
            <i
              className="bi bi-star btn btn-outline-warning"
              style={{
                position: "absolute",
                top: "15px",
                left: "15px",
                padding: "5px 10px",
                borderRadius: "3px",
                outline: "none !important",
                cursor: "pointer",
              }}
            >
            &nbsp; {props.menuItem.specialTag}
          </i> 
        )}
        {/* 장바구니에 추가되었는지 확인하기 */}
        {isAddingToCart ? ( 
          <div 
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
            }}
          >
            <MiniLoader/>
          </div>
        ) : (
          <i
          className="bi bi-cart-plus btn btn-outline-danger"
          style={{
            position: "absolute",
            top: "15px",
            right: "15px",
            padding: "5px 10px",
            borderRadius: "3px",
            outline: "none !important",
            cursor: "pointer",
          }}
          onClick = {() => handleAddToCart(props.menuItem.id)}
        ></i>
        )}
  
          

          <div className="text-center">
            <p className="card-title m-0 text-success fs-3 HSSanTokki20">
              <Link 
                to={`/menuItemsDetails/${props.menuItem.id}`}
                style={{
                  textDecoration: "none", 
                  color:"black",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 1, // 보여줄 줄 수
                  overflow: "hidden", // 넘치는 텍스트 숨기기
                  textOverflow: "ellipsis"  
                  }}>
                {props.menuItem.name}
              </Link>
            </p>
            <p 
              className="badge bg-secondary" 
              style={{ fontSize: "12px" }}>
              {props.menuItem.category}
            </p>
          </div>
          <p 
            className="card-text"
            style={{
              textAlign: "center",
              fontWeight: "light",
              fontSize: "14px",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3, // 보여줄 줄 수
              overflow: "hidden", // 넘치는 텍스트 숨기기
              textOverflow: "ellipsis"  
            }}>
              {props.menuItem.description}
          </p>
          <div className="row text-center">
            <h4>₩{props.menuItem.price}</h4>
          </div>
        </div>
      </div>
    </div>
    )
}

export default MenuItemCard;