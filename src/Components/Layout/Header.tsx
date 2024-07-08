import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { cartItemModel, userModel } from "../../Interfaces";
import { RootState } from "../../Storage/Redux/store";
import { useSelector, useDispatch } from "react-redux";
import { emptyUserState, setLoggedInUser } from "../../Storage/Redux/userAuthSlice";
import { SD_Roles } from "../../Utility/SD";

let logo = require("../../Assets/Images/kimchi.png");

function Header(){

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const shoppingCartFromStore: cartItemModel[] = useSelector(
        (state : RootState) => state.shoppingCartStore.cartItems ?? []
        //Store.ts에서의 type
    );
    const userData : userModel = useSelector(
        (state: RootState) => state.userAuthStore
    );

    const handleLogout = () => { //로그아웃 시 토큰 해제 
        localStorage.removeItem("token");
        dispatch(setLoggedInUser({...emptyUserState}));
        navigate("/");
    }
    

    return (
        <div>
          <nav className="navbar navbar-expand-lg bg-dark navbar-dark">
            <div className="container-fluid">
            <NavLink className="nav-link" aria-current="page" to="/">
                <img src={logo} style={{height: "40px"}} className="m-1" />
            </NavLink>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarSupportedContent" 
                    aria-controls="navbarSupportedContent" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 w-100"> 
                        <li className="nav-item">
                            <NavLink className="nav-link" aria-current="page" to="/">
                                    홈으로
                            </NavLink>
                        </li>
                        {/* 관리자가 아닌경우 order에 개별 주문 표시하기 */}
                        {userData.role == SD_Roles.ADMIN ? (
                            <li className="nav-item dropdown">
                                <a 
                                    className="nav-link dropdown-toggle" 
                                    href="#" 
                                    role="button" 
                                    data-bs-toggle="dropdown" 
                                    aria-expanded="false" >
                                    Admin Panel
                                </a>
                            <ul className="dropdown-menu">
                                <li 
                                    style={{cursor:"pointer"}}
                                    className="dropdown-item" 
                                    onClick={()=> navigate("menuItem/menuitemlist")}>
                                    Menu Item
                                </li>
                                <li 
                                    style={{cursor:"pointer"}}
                                    className="dropdown-item" 
                                    onClick={()=> navigate("order/myorders")}>
                                    My Orders
                                </li>
                                <li 
                                    style={{cursor:"pointer"}}
                                    className="dropdown-item" 
                                    onClick={()=> navigate("order/allorders")}>
                                    All Orders
                                </li>
                            </ul>
                        </li> //관리자인 경우 드롭박스표시
                        ) : (
                            <li className="nav-item">
                            <NavLink className="nav-link" aria-current="page" to="/order/myorders">
                                Orders
                            </NavLink>
                        </li> //관리자가 아닌 경우 orders 표시 
                        )} 

                        

                        

                        {/* 장바구니 */}
                        <li className="nav-item">
                            <NavLink className="nav-link" aria-current="page" to="/shoppingCart">
                            <i className="bi bi-cart"></i>
                            {userData.id && `(${shoppingCartFromStore.length})`}
                            {/* 로그읜 된 경우에만 카트 아이템 수량 표시하기 */}
                            </NavLink>
                        </li>

                        <div className="d-flex" style={{marginLeft: "auto"}}>
                            { userData.id && (
                                <>
                                <li className="nav-item">
                                    <button
                                        className="nav-link active"
                                        style={{
                                            cursor: "pointer",
                                            background: "transparent",
                                            border: 0,
                                        }}
                                    > welcome, {userData.fullName} 
                                    </button>
                                </li>


                                <li className="nav-item">
                                    <button
                                        className="btn btn-success btn-outlined rounded-pill text-white mx-2"
                                        style={{
                                            border: "none",
                                            height: "40px",
                                            width: "100px",
                                    }}
                                    onClick={handleLogout}> 
                                        Logout
                                    </button>
                                </li>
                              </>
                            )}
                            { !userData.id && (
                                <>
                                <li className="nav-item text-white">
                                    <NavLink className="nav-link" to="/register">
                                        Register
                                    </NavLink>
                                </li>
                                <li className="nav-item text-white">
                                    <NavLink className="btn btn-success btn-outlined rounded-pill text-white mx-2"
                                        style={{
                                            border: "none",
                                            height: "40px",
                                            width: "100px",
                                        }}
                                        to="/login">
                                            Login
                                    </NavLink>
                                </li>
                                </>
                            )}
                        </div>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
    )
}
export default Header;