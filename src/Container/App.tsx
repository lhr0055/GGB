import React, { useState } from 'react';
import {Footer, Header} from "../Components/Layout";
import { 
  Home, 
  NotFound, 
  MenuItemDetails, 
  ShoppingCart, 
  Login, 
  Register, 
  AuthentationTest,
  AccessDenied, 
  AuthentationTestAdmin, 
  Payment, 
  OrderConfirmed, 
  MyOrders, 
  OrderDetails, 
  AllOrders, 
  MenuItemList, 
  MenuItemUpsert 
} from '../Pages';
import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetShoppingCartsQuery } from '../Apis/shoppingCartApi';
import { setShoppingCart } from '../Storage/Redux/shoppingCartSlice';
import userModel from '../Interfaces/userModel';
import jwt_decode from "jwt-decode";
import { setLoggedInUser } from '../Storage/Redux/userAuthSlice';
import { RootState } from '../Storage/Redux/store';
import '../index.css';


function App() {
  const dispatch = useDispatch(); //리덕스에 저장된 값 가져오기
  const [skip, setSkip] = useState(true);
  const userData = useSelector((state: RootState)=>state.userAuthStore);
  const {data, isLoading}  = useGetShoppingCartsQuery(userData.id, {
    skip: skip,
  }); //사용자id값을 기준으로 앱이 로드될 떄 장바구니 항목이 로드되어야하며 


  //로그인할 때 로컬에서 토큰을 가져온다. 
  useEffect(()=>{
    const localToken = localStorage.getItem("token");
    if(localToken){
      const { fullName, id, email, role } : userModel = jwt_decode(localToken);
      dispatch(setLoggedInUser({ fullName, id, email, role}));
    }
  }, []);

  useEffect(()=>{
    if(!isLoading && data){ //장바구니가 로드되는 상태가 아니면 설정해야한다. 
      console.log(data)
      dispatch(setShoppingCart(data.result?.cartItems)) 
      // shoppingCartModel 중 cartItems 항목만 가져오기 
    }
  },[data]);

  useEffect(()=>{
    if(userData.id) setSkip(false);
  }, [userData]);

  return (
    <div>
      <Header/>
      <div className='pb-5'>
        <Routes>
          <Route path='/' element={<Home />}></Route>
          <Route path='/menuItemsDetails/:menuItemId' element={<MenuItemDetails/>}></Route>
          <Route path='/shoppingCart' element={<ShoppingCart />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/register' element={<Register />}></Route>
          
          <Route
            path='/authentication'
            element={<AuthentationTest/>}
          ></Route>
          <Route
            path='/authorization'
            element={<AuthentationTestAdmin/>}
          ></Route>
          <Route path='/accessDenied' element={<AccessDenied/>}/>
          <Route path='/payment' element={<Payment/>}/>

          <Route path='order/orderconfirmed/:id' element={<OrderConfirmed/>}/>
          <Route path='/order/myOrders' element={<MyOrders />}/>
          <Route path='/order/orderDetails/:id' element={<OrderDetails />}/>
          {/* 주문정보 id값에 따른 주문 상세정보 페이지 라우팅 */}
          <Route path='/order/allOrders' element={<AllOrders />}/>
          
          <Route path='/menuItem/menuitemlist' element={<MenuItemList />}/>
          <Route path='/menuItem/menuItemUpsert/:id' element={<MenuItemUpsert />}/>
          <Route path='/menuItem/menuItemUpsert' element={<MenuItemUpsert />}/>
          
          <Route path='*' element={<NotFound />}/>
        </Routes>
      </div>
      <Footer/>
    </div>
  );
}

export default App;