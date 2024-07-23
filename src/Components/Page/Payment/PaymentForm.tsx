import {useStripe, useElements, PaymentElement} from '@stripe/react-stripe-js';
import { useState } from 'react';
import { toastNotify } from '../../../Helper';
import { orderSummaryProps } from '../Order/orderSummaryProps';
import { apiResponse, cartItemModel, userModel } from '../../../Interfaces';
import { SD_Status } from '../../../Utility/SD';
import { useCreateOrderMutation } from '../../../Apis/orderApi';
import { useNavigate } from 'react-router-dom';
import { useUpdateShoppingCartMutation } from '../../../Apis/shoppingCartApi';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity } from '../../../Storage/Redux/shoppingCartSlice';
import { RootState } from "../../../Storage/Redux/store";

const PaymentForm = ({data, userInput} : orderSummaryProps) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const userData: userModel = useSelector(
    (state: RootState) => state.userAuthStore
  )
  const shoppingCartFromStore: cartItemModel[] = useSelector(
    (state : RootState) => state.shoppingCartStore.cartItems ?? []
    //Store.ts에서의 type
);
  const [updateShoppingCart] = useUpdateShoppingCartMutation();
  const [createOrder] = useCreateOrderMutation();
  const [isProcessing, setIsProcessing] = useState(false);
  // console.log("data");
  // console.log(data);

  //쇼핑카트 비우기 기능
  const handleQuantity = (
    updateQuantityBy: number,
    cartItem: cartItemModel
  ) => {
    updateShoppingCart({
      menuItemId: cartItem.menuItem?.id,
      updateQuantityBy: 0,
      userId: userData.id, //사용자 id 가져오기 
    });
    dispatch(removeFromCart({cartItem, quantity:0}));
  }

  const handleSubmit = async (e : React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    
    setIsProcessing(true);
    const result = await stripe.confirmPayment({
      //`Elements` 결제 요소를 생성하는데 사용된 요소 인스턴스 
      elements,
      confirmParams: {
        return_url: "https://example.com/order/123/complete", //결제 성공 시 이동되는 url 주소
      },
      redirect: "if_required"
    });

    if (result.error) {
      // console.log(result.error.message);
      toastNotify("예기치 않은 오류가 발생했습니다", "error"); //결제 실패 시 오류 토스트 메시지 
      setIsProcessing(false);
    } else {
      console.log("result:",result);
      let grandTotal = 0;
      let totalItems = 0;
      const orderDetailsDTO: any = [];
      data.cartItems?.forEach((item:cartItemModel)=>{
        const tempOrderDetail: any = {};
        tempOrderDetail["menuItemId"] = item.menuItem?.id;
        tempOrderDetail["quantity"] = item.quantity;
        tempOrderDetail["itemName"] = item.menuItem?.name;
        tempOrderDetail["price"] = item.menuItem?.price;
        orderDetailsDTO.push(tempOrderDetail);
        grandTotal += item.quantity! * item.menuItem?.price!; //!는 값이 있는지 확인해준다
        totalItems += item.quantity!;
      });

      const response: apiResponse = await createOrder({
        pickupName: userInput.name,
        pickupPhoneNumber: userInput.phoneNumber,
        pickupEmail: userInput.email,
        totalItems: totalItems,
        orderTotal: grandTotal,
        orderDetailsDTO: orderDetailsDTO,
        stripePaymentIntentID: data.stripePaymentIntentId,
        applicationUserId: data.userId,
        status:
          result.paymentIntent.status === "succeeded"
          ? SD_Status.CONFIRMED
          : SD_Status.PAYMENT,
      });

      if(response){
        if (response.data?.result.status === SD_Status.CONFIRMED) {
          navigate(
            `/order/orderConfirmed/${response.data.result.orderHeaderId}`
          );
        } else {
        navigate("/failed")
      }
    }
  }
    setIsProcessing(false);
  };
  //"status" : "string",
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        disabled={!stripe || isProcessing}
        className='btn btn-dark mt-5 w-100'>
        <span id="button-text">
          {isProcessing ? "Processing ..." : "결제하기"}
        </span>
      </button>
    </form>
  );
};

export default PaymentForm;