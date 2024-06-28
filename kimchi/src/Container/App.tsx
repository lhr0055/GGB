import React, {useEffect} from 'react';
import { Header, Footer } from "../Components/Layout";
import {
    Home,
    NotFound,
    MenuItemDetails,
    ShoppingCart,
    Login,
    Register,
    AuthenticationTest,
    AuthenticationTestAdmin,
    AccessDenied
} from "../Pages";
import {Routes,Route} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useGetMenuItemsQuery} from "../Apis/menuItemApi";
import {useGetShoppingCartQuery} from "../Apis/shoppingCartApi";
import {setShoppingCart} from "../Storage/Redux/shoppingCartSlice";
import userModel from "../Interfaces/userModel";
import jwtDecode from "jwt-decode";
import {setLoggedInUser} from "../Storage/Redux/userAuthSlice";
import {RootState} from "../Storage/Redux/store";


function App() {
    const dispatch = useDispatch();
    const userData : userModel = useSelector((state: RootState) => state.userAuthStore);
    const {data, isLoading} = useGetShoppingCartQuery(userData.id);


    useEffect(() => {
        const localToken = localStorage.getItem("token");
        if(localToken) {
            const {fullName, id, email, role}: userModel = jwtDecode(localToken);
            dispatch(setLoggedInUser({ fullName, id, email, role }));
        }
    }, []);

    useEffect(() => {
        if(!isLoading) {
            console.log(data.result);
            dispatch(setShoppingCart(data.result?.cartItems))
        }
    }, [data]);



  return (
    <div>
        <Header/>
        <div className="pb-5">
            <Routes>
                <Route path="/" element={<Home/>}></Route>
                <Route path="/menuItemDetails/:menuItemId"
                       element={<MenuItemDetails/>}></Route>
                <Route path="/ShoppingCart" element={<ShoppingCart/>}></Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound/>}></Route>

                <Route path="/authentication"
                       element={ <AuthenticationTest/> }/>

                <Route path="/authorization"
                       element={<AuthenticationTestAdmin/>}/>

                <Route path="/accessDenied" element={<AccessDenied/>}/>
            </Routes>
        </div>
        <Footer/>
    </div>
  );
}

export default App;
