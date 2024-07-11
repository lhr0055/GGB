
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

let orderImage = require("../../Assets/Images/order.png")

function OrderConfirmed(){
    const {id} = useParams();
    // console.log(id);
    const navigate = useNavigate();
    
    return(
    <div className="w-100 text-center d-flex justify-content-center align-items-center">
      <div>
        <i
          style={{ fontSize: "6rem" }}
          className="bi bi-check2-circle text-danger">
        </i>
        <div className="pb-5">
          <h5 className="mt-1"> 주문 ID: {id}</h5>
            <img
              src={orderImage}
              style={{ 
                width: "50%", 
                borderRadius: "10px", 
                boxShadow:"5px 5px 10px",
                }}>
            </img>
        </div>
        <button className="btn btn-outline-danger rounded-pill"
              style={{cursor:"pointer"}}
              onClick={()=> navigate("/order/myorders")}>
              주문내역
          </button>
      </div> 
    </div>
    ); 
}

export default OrderConfirmed;
