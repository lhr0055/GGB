import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const paymentApi = createApi({
    reducerPath: "paymentApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://redkimchiapi.azurewebsites.net/api/",
        prepareHeaders: (headers:Headers, api) =>{
            const token = localStorage.getItem("token");
            token&&headers.append ("Authorization", "Bearer " + token);
        },
    }),
    endpoints: (builder) => ({
        initiatePayment : builder.mutation({
            query: (userId) => ({ //필요한 파라메터는 userId이다.(api에서 확인 가능 )
                url: "payment",
                method: "POST",
                params: {
                    userId : userId
                }
            }),
        }),
    }),
});

export const { useInitiatePaymentMutation } = paymentApi;
export default paymentApi;