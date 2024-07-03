import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const menuItemApi = createApi({
    reducerPath: "menuItemApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://redkimchiapi.azurewebsites.net/api/",
        // baseUrl: "https://localhost:7181/api/",
        prepareHeaders: (headers:Headers, api) =>{
            const token = localStorage.getItem("token");
            token && headers.append ("Authorization", "Bearer " + token);
        }
    }),
    tagTypes: ["MenuItems"],
    endpoints: (builder) => ({
        getMenuItems: builder.query({
            query: () => ({
                url: "menuitem"
            }),
            providesTags: ["MenuItems"]
        }),
        getMenuItemById: builder.query({
            query: (id) => ({
                url: `menuitem/${id}`,
            }),
            providesTags: ["MenuItems"],
        }),
        //메뉴항목 추가하기 
        crateMenuItem : builder.mutation({
            query: (data)=>({
                url:"menuitem",
                method: "POST",
                body: data,
            }),
            invalidatesTags:["MenuItems"]
        }),
        //메뉴항목 업데이트 
        updateMenuItem : builder.mutation({
            query: ({data, id})=>({
                url:"menuitem/" + id,
                method: "PUT",
                body: data,
            }),
            invalidatesTags:["MenuItems"]
        }),
        //메뉴항목 삭제하기 
        deleteMenuItem : builder.mutation({
            query: (id)=>({
                url:"menuitem/" + id,
                method: "DELETE",
            }),
            invalidatesTags: ["MenuItems"]
        })
    }),
});

export const { 
    useGetMenuItemsQuery, useGetMenuItemByIdQuery, 
    useCrateMenuItemMutation, useDeleteMenuItemMutation, useUpdateMenuItemMutation
 } = menuItemApi;
export default menuItemApi;