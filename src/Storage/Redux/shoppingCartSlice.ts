import { createSlice } from "@reduxjs/toolkit";
import { shoppingCartModel } from "../../Interfaces";

const initialState : shoppingCartModel = {
    cartItems: [],
};

export const shoppingCartSlice = createSlice({
    name: "cartItems",
    initialState: initialState,
    reducers: {
        setShoppingCart: (state, action) => {
            state.cartItems = action.payload;
        },
        updateQuantity: (state, action) => {
            //payload - cart item that needs to be updated, newquantity
            state.cartItems = state.cartItems?.map((item)=>{
                if(item.id === action.payload.cartitem.id){
                // id가 일치하면 수량을 업데이트 한다. 
                    item.quantity = action.payload.quantity;
                }
                return item;
            });
        },
        removeFromCart: (state, action) => {
            //payload - cart item that needs to be updated, newquantity
            state.cartItems = state.cartItems?.filter((item)=>{
                if(item.id === action.payload.cartitem.id){
                // id가 일치하면 수량을 업데이트 한다. 
                    return null;
                }
                return item;
            });
        },
    },
});

export const { setShoppingCart, updateQuantity, removeFromCart } = shoppingCartSlice.actions;
export const shoppingCartReducer = shoppingCartSlice.reducer; //장바구니는 앱이 로드될 때 로드되어야한다. 