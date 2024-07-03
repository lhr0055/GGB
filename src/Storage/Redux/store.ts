import { configureStore } from "@reduxjs/toolkit";
import { menuItemReducer } from "./menuItemSlice";
import { authApi, menuItemApi, orderApi, paymentApi, shoppingCartApi } from "../../Apis";
import { shoppingCartReducer } from "./shoppingCartSlice";
import { userAuthReducer } from "./userAuthSlice";

const store = configureStore({
    reducer: {
        menuItemStore: menuItemReducer,
        shoppingCartStore: shoppingCartReducer,
        userAuthStore: userAuthReducer,
        [menuItemApi.reducerPath]: menuItemApi.reducer,
        [shoppingCartApi.reducerPath]: shoppingCartApi.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [paymentApi.reducerPath]: paymentApi.reducer,
        [orderApi.reducerPath]: orderApi.reducer,
    },
    middleware: (getDefaultMiddleWare) => 
        getDefaultMiddleWare()
            .concat(menuItemApi.middleware)
            .concat(shoppingCartApi.middleware)
            .concat(authApi.middleware)
            .concat(paymentApi.middleware)
            .concat(orderApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
//타입스크립트에서 루트 유형을 예상하고 내보낸다 .
export default store;