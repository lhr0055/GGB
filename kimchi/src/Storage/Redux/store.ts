import { configureStore} from "@reduxjs/toolkit";
import { menuItemReducer} from "./menuItemSlice";
import { menuItemApi } from "../../Apis"



const store = configureStore({
    reducer:{
        menuItemStore: menuItemReducer,
        [menuItemApi.reducerPath] : menuItemApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(menuItemApi.middleware),
});


export type RootState = ReturnType<typeof store.getState>; // 타입스크립트에서만
export default store;