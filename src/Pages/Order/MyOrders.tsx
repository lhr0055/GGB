import React from "react";
import { withAuth } from "../../HOC";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { RootState } from "../../Storage/Redux/store";
import { useGetAllOrdersQuery } from "../../Apis/orderApi";
import OrderList from "../../Components/Page/Order/OrderList";
import { MainLoader } from "../../Components/Page/Common";

function MyOrders(){
    const userId = useSelector((state: RootState)=> state.userAuthStore.id);
    const{data, isLoading} = useGetAllOrdersQuery({userId});

    return(
      <>
      {isLoading && <MainLoader/>} 
      {/* 로딩중이 아닐 떄는 데이터 표시하기 */}
      {!isLoading && (  
      <>
        <div className="d-flex align-items-center justify-content-between mx-5 mt-5">
          <h1 className="text-dark BookkMyungjo-Bd">내 주문내역</h1>
        </div>
        <OrderList isLoading={isLoading} orderData={data?.apiResponse.result} />

          {!(data?.apiResponse.result.length > 0) && (
            <div className="px-5 py-3">
              주문내역이 없습니다.
            </div> 
          )}
      </>
      )}
      </>
    )
}

export default withAuth(MyOrders);