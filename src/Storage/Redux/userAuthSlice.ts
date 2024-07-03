import { createSlice } from "@reduxjs/toolkit";
import { userModel } from "../../Interfaces";
//초기화
export const emptyUserState: userModel = {
    fullName:"",
    id:"",
    email:"",
    role:""
};

export const userAuthSlice = createSlice({
    name: "userAuth",
    initialState: emptyUserState,
    reducers: { 
        setLoggedInUser: (state, action) => { //이 내용을 확인하여 로그인 정보 가져오기 
            state.fullName = action.payload.fullName;
            state.id = action.payload.id;
            state.email = action.payload.email; 
            state.role = action.payload.role;
        }, //해당 페이로드에서 추출하여 할당 
    },
}); //사용자가 로그인하면 여기서 전달할 payload의 모든 세부 정보를 갖음 

export const { setLoggedInUser } = userAuthSlice.actions;
export const userAuthReducer = userAuthSlice.reducer;

//store.ts에 전달 