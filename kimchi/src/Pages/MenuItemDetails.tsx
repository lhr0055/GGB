import React from "react";
import { useParams } from "react-router-dom";
import { useGetMenuItemByIdQuery} from "../Apis/menuItemApi";
import { useNavigate} from "react-router-dom";
import { useState} from "react";
import {useUpdateShoppingCartMutation} from "../Apis/shoppingCartApi";
import {MainLoader} from "../Components/Page/Common";
// USER ID = 0d3b40b2-4ba2-49b2-8a24-558072b1ce54
const hhh = require("../Assets/Images/fd.jpg");


function MenuItemDetails() {
    const { menuItemId } = useParams();
    const { data, isLoading } = useGetMenuItemByIdQuery(menuItemId);
    const navigate = useNavigate();
    const [quantity, setQuantity] = React.useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
    const [updateShoppingCart] = useUpdateShoppingCartMutation();

    const handleQuantity = (counter: number) => {
        let newQuantity = quantity + counter
        if(newQuantity == 0) {
            newQuantity = 1;
        }
        setQuantity(newQuantity);
        return;
    };

    const handleAddToCart = async (menuItemId:number) => {
        setIsAddingToCart(true);

        const response = await updateShoppingCart({
            menuItemId:menuItemId,
            updateQuantityBy:quantity,
            userId:"0d3b40b2-4ba2-49b2-8a24-558072b1ce54"
        });

        console.log(response);

        setIsAddingToCart(false);
    }


    return (
        <div className="container pt-4 pt-md-5">

            {!isLoading ? (
                <div className="row">
                <div className="col-7">
                    <h2 className="text-success">{data.result?.name}</h2>
                    <span>
            <span
                className="badge text-bg-dark pt-2"
                style={{height: "40px", fontSize: "20px"}}
            >
              {data.result?.category}
            </span>
          </span>
                    <span>
            <span
                className="badge text-bg-light pt-2"
                style={{height: "40px", fontSize: "20px"}}
            >
              {data.result?.specialTag}
            </span>
          </span>
                    <p style={{fontSize: "20px"}} className="pt-2">
                        {data.result?.description}
                    </p>
                    <span className="h3">{data.result?.price}</span> &nbsp;&nbsp;&nbsp;
                    <span
                        className="pb-2  p-3"
                        style={{border: "1px solid #333", borderRadius: "30px"}}
                    >
            <i onClick={() => {
                handleQuantity(-1);
            }}
                className="bi bi-dash p-1"
                style={{fontSize: "25px", cursor: "pointer"}}
            ></i>
            <span className="h3 mt-3 px-3">{quantity}</span>
            <i
                className="bi bi-plus p-1" onClick={() => {
                    handleQuantity(+1);
            }}
                style={{fontSize: "25px", cursor: "pointer"}}
            ></i>
          </span>
                    <div className="row pt-4">
                        <div className="col-5">
                            <button className="btn btn-success form-control"
                            onClick={() => handleAddToCart(data.result?.id)}>
                                Add to Cart
                            </button>
                        </div>

                        <div className="col-5 ">
                            <button className="btn btn-secondary form-control"
                            onClick={() => navigate(-1)}>
                                Back to Home
                            </button>
                        </div>
                    </div>
                </div>
                <div className="col-5">
                    <img
                        src={hhh}
                        width="100%"
                        style={{borderRadius: "50%"}}
                        alt="No content"
                    ></img>
                </div>
            </div>): (
                <div
                className="d-flex justify-content-center"
                style={{ width: "100%" }}
                >
                    <MainLoader/>
                </div>
                ) }

        </div>
    )
}

export default MenuItemDetails
