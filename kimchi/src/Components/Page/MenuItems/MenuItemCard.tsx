import React, {useState} from "react";
import {apiResponse, menuItemModel} from "../../../Interfaces";
import {Link} from "react-router-dom";
import {useUpdateShoppingCartMutation} from "../../../Apis/shoppingCartApi";
import {MiniLoader} from "../Common";
import {toastNotify} from "../../../Helper";
let menudd = require("../../../Assets/Images/fd.jpg")

interface Props {
    menuitem: menuItemModel;
}

function MenuItemCard(props:Props) {
    const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
    const [updateShoppingCart] = useUpdateShoppingCartMutation();

    const handleAddToCart = async (menuItemId:number) => {
        setIsAddingToCart(true);

        const response: apiResponse = await updateShoppingCart({
            menuItemId:menuItemId,
            updateQuantityBy: 1,
            userId:"0d3b40b2-4ba2-49b2-8a24-558072b1ce54"
        });
        if(response.data && response.data.isSuccess) {
            toastNotify("Item added to cart successfully.");
        }



        setIsAddingToCart(false);
    }

    return (
        <div className="col-md-4 col-12 p-4">
            <div
                className="card"
                style={{boxShadow: "0 1px 7px 0 rgb(0 0 0 / 50%)"}}
            >
                <div className="card-body pt-2">
                    <div className="row col-10 offset-1 p-4">
                        <Link to={`/menuItemDetails/${props.menuitem.id}`}>

                        <img
                            src={menudd}
                            style={{borderRadius: "50%"}}
                            alt=""
                            className="w-100 mt-5 image-box"
                        />
                        </Link>
                    </div>

                    <i
                        className="bi bi-star btn btn-success"
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
                        &nbsp; {props.menuitem.specialTag}
                    </i>


                    {isAddingToCart?(
                        <div style={{
                            position: "absolute",
                            top: "15px",
                            right: "15px",
                        }}
                        >

                            <MiniLoader />

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
                        onClick={() => handleAddToCart(props.menuitem.id)}
                    ></i>)}



                    <div className="text-center">
                        <p className="card-title m-0 text-success fs-3">
                            <Link to={`/menuItemDetails/${props.menuitem.id}`}
                                style={{ textDecoration : "none", color: "green"}}
                            >
                            {props.menuitem.name}
                            </Link>
                            </p>
                        <p className="badge bg-secondary" style={{fontSize: "12px"}}>
                            {props.menuitem.category}
                        </p>
                    </div>
                    <p className="card-text" style={{textAlign: "center"}}>
                        {props.menuitem.description}
                    </p>
                    <div className="row text-center">
                        <h4>${props.menuitem.price}</h4>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default MenuItemCard;
