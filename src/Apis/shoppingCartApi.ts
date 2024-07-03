import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const shoppingCartApi = createApi({
    reducerPath: "shoppingCartApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://redkimchiapi.azurewebsites.net/api/",
        prepareHeaders: (headers:Headers, api) =>{
            const token = localStorage.getItem("token");
            token&&headers.append ("Authorization", "Bearer " + token);
        },
    }),
    tagTypes: ["ShoppingCarts"],
    endpoints: (builder) => ({
        
        getShoppingCarts: builder.query({
            query: (userId) => ({
                url: `shoppingcart`,
                params:{
                    userId:userId
                }
            }),
            providesTags: ["ShoppingCarts"],
        }),
        updateShoppingCart: builder.mutation({
            query: ({menuItemId, updateQuantityBy, userId}) => ({
                url: "shoppingcart",
                method: "POST",
                params: {
                    menuItemId : menuItemId, //이름이 같으므로 생략가능하다 
                    updateQuantityBy, 
                    userId,
                }
            }),
            invalidatesTags: ["ShoppingCarts"], //무효화
        })
    }),
});

export const { useGetShoppingCartsQuery, useUpdateShoppingCartMutation } = shoppingCartApi;
export default shoppingCartApi;