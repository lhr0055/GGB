import React from "react";
import { useLocation } from "react-router-dom";
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import { PaymentForm } from "../Components/Page/Payment";
import { OrderSummary } from "../Components/Page/Order";

function Payment() {
    const {
        state: { apiResult, userInput },
    } = useLocation()|| {}; 
    // 탐색 시 state에서 전달하는 모든 항목이 추출되고 자동으로 검색된다. 
    // console.log(apiResult,",,,,?");
    // console.log(userInput);
    const stripePromise = loadStripe(
        // 임시 test api key
        "pk_test_TYooMQauvdEDq54NiTphI7jx"
        // "pk_test_51OFV1BFzFaS5ZO8iIXxxORORopZdKVSEeV83b8I9LHx9LwMPINjPJ18zg9KueWgCOrz5cAJzFpnYjwUHAi4RCx1B00QuWQHJ9a"
    );
    const options = {
        // passing the client secret obtained from the server
        clientSecret: apiResult.clientSecret,
      };

    if (!apiResult || !userInput) {  // apiResult나 userInput이 없는 경우 처리
        return <div>Error: 결제 실패하였습니다.</div>;
    }

    return (
    <Elements stripe={stripePromise} options={options}>
        <div className="container m-5 p-5">
            <div className="row">
                <div className="col-md-7"> 
                    <OrderSummary data={apiResult} userInput={userInput}/> 
                    {/* api에서 가져온 값(props) 전달하기 */}
                </div>
                <div className="col-md-4 offset-md-1">
                    <h3 className="text-dark BookkMyungjo-Bd"> 결제방식 </h3>
                    <div className="mt-5">
                        <PaymentForm data={apiResult} userInput={userInput} />
                    </div>
                </div>
            </div>
        </div> 
    </Elements>
    )
}
export default Payment;