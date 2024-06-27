import { createSlice } from "@reduxjs/toolkit";
import {shoppingCartModel} from "../../Interfaces";


const initialState: shoppingCartModel= {
    cartItems: [],
};


export const shoppingCartSlice = createSlice({
    name: "cartItems",
    initialState: initialState,
    reducers: {
        setShoppingCart: (state, action) => {
            state.cartItems = action.payload;
        },
        updateQuantity: (state,action) => {
            state.cartItems = state.cartItems?.map((item) => {
                if(item.id === action.payload.cartItem.id) {
                    item.quantity = action.payload.quantity;
                }
                return item;
            });
        },
        removeFromCart: (state,action) => {
            state.cartItems = state.cartItems?.filter((item) => {
                if(item.id === action.payload.cartItem.id) {
                    return null;
                }
                return item;
            });
        },
    },
});

export const { setShoppingCart, updateQuantity, removeFromCart } = shoppingCartSlice.actions;
export const shoppingCartReducer = shoppingCartSlice.reducer;