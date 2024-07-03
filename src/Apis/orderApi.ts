import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const orderApi = createApi({
    reducerPath: "orderApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://redkimchiapi.azurewebsites.net/api/",
        // baseUrl: "https://redmangoapi.azurewebsites.net/api/",
        prepareHeaders: (headers:Headers, api) =>{
            const token = localStorage.getItem("token");
            token && headers.append ("Authorization", "Bearer " + token);
        },
    }),
    tagTypes: ["Orders"],
    endpoints: (builder) => ({
        createOrder : builder.mutation({
            query: (orderDetails) => ({ //필요한 파라메터는 userId이다.(api에서 확인 가능 )
                url: "order",
                method: "POST",
                headers: {
                    "Content-type" : "application/json",
                },
                body: orderDetails,
            }),
            invalidatesTags: ["Orders"], //게시할 때 자동으로 검색하여 업데이트 된다. 
        }),
        getAllOrders: builder.query({
            query: ({userId, searchString, status, pageSize, pageNumber}) => ({ //모든 주문정보를 알기위해서는 userId가 필요하다. 
                url: "order", //매개변수
                params: {
                    ...(userId && { userId }),
                    ...(searchString && { searchString }),
                    ...(status && { status }),
                    ...(pageSize && { pageSize }),
                    ...(pageNumber && { pageNumber }),
                  },
            }),
            transformResponse(apiResponse: {result: any}, meta: any){
                return{
                    apiResponse,
                    totalRecords: meta.response.headers.get("X-Pagination"),
                };
            },
            providesTags: ["Orders"]
        }),
        getOrderDetails: builder.query({ //개별주문정보를 가져오는 엔드포인트 
            query: (id) => ({
                url: `order/${id}`,
            }),
            providesTags: ["Orders"],
        }),
        //상태 업데이트 put (order api)
        updateOrderHeader : builder.mutation({
            query: (orderDetails)=>({
                url:"order/" + orderDetails.orderHeaderId,
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: orderDetails,
            }),
            invalidatesTags:["Orders"],
        }),
    }),
});

export const { 
    useCreateOrderMutation, 
    useGetAllOrdersQuery, 
    useGetOrderDetailsQuery,
    useUpdateOrderHeaderMutation,
 } = orderApi;
export default orderApi;