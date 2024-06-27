import React from 'react';
import { Header, Footer } from "../Components/Layout";
import {Home, NotFound, MenuItemDetails, ShoppingCart, Login, Register} from "../Pages";
import {Routes,Route} from "react-router-dom";
import {useEffect} from "react";
import {useDispatch } from "react-redux";
import {useGetMenuItemsQuery} from "../Apis/menuItemApi";
import {useGetShoppingCartQuery} from "../Apis/shoppingCartApi";
import {setShoppingCart} from "../Storage/Redux/shoppingCartSlice";


function App() {
    const dispatch = useDispatch();

    const {data, isLoading} = useGetShoppingCartQuery(
        "0d3b40b2-4ba2-49b2-8a24-558072b1ce54"
    );

    useEffect(() => {
        if(!isLoading) {
            console.log(data.result);
            dispatch(setShoppingCart(data.result?.cartItems))
        }
    }, [data]);



  return (
    <div>
        <Header/>
        <div className="pb-5">
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/menuItemDetails/:menuItemId"
                       element={<MenuItemDetails/>}></Route>
                <Route path="/ShoppingCart" element={<ShoppingCart/>}></Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound/>}></Route>

            </Routes>
        </div>
        <Footer/>
    </div>
  );
}

export default App;
