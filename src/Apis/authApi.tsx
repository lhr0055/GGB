import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://redkimchiapi.azurewebsites.net/api/", //swagger주소 
    }),
    endpoints: (builder) => ({
        registerUser : builder.mutation({
            query: (userData) => ({
                url: "auth/register",
                method: "POST",
                headers: {
                    "Content-type" : "application/json",
                },
                body: userData
            }),
        }),
        loginUser : builder.mutation({
            query: (userCredentials) => ({
                url: "auth/login",
                method: "POST",
                headers: {
                    "Content-type" : "application/json",
                },
                body: userCredentials
            }),
        }),
    }),
});

export const { useRegisterUserMutation, useLoginUserMutation } = authApi;
export default authApi;