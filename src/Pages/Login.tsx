import React, { useState } from "react";
import { inputHelper } from "../Helper";
import { apiResponse, userModel } from "../Interfaces";
import { useLoginUserMutation } from "../Apis/authApi";
import jwt_decode from "jwt-decode";
import { useDispatch } from "react-redux";
import { setLoggedInUser } from "../Storage/Redux/userAuthSlice";
import { useNavigate } from "react-router-dom";
import { MainLoader } from "../Components/Page/Common";

function Login() {
  const [error, setError] = useState("");
  const [loginUser] = useLoginUserMutation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState({ 
    userName: "", //name="userName "
    password: "",
  });

  const handleUserInput = (
    e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHelper(e, userInput) //임시데이터에 입력값헬퍼로 전달한다. 
    setUserInput(tempData);//임시데이터로 입력값을 전달한다.(입력받을 수 있게함))
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); //로딩되는동안 일어나야 할 일들 

    const response : apiResponse = await loginUser({
      userName: userInput.userName, 
      password: userInput.password,
    });
    
    if(response.data){
      // console.log(response.data);
      const {token} = response.data.result //응답 안에 토큰 얻어오기
      const {fullName, id, email, role} : userModel = jwt_decode(token);
      localStorage.setItem("token", token); 
      dispatch(setLoggedInUser({ fullName, id, email, role}));
      navigate("/");
    } else if(response.error){
      // console.log(response.error.data.errorMessages[0]);
      setError(response.error.data.errorMessages[0]);
    }
    setLoading(false) //정보가 가져와지면 로딩 false 
  }

    return (
        <div className="container text-center">
        {loading && <MainLoader/>}
        <form method="post" onSubmit={handleSubmit}>
          <h1 className="mt-5">Login</h1>
          <div className="mt-5">
            <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
              <input
                type="text"
                className="form-control"
                placeholder="이름"
                required
                name="userName"
                value={userInput.userName}
                onChange={handleUserInput}
              />
            </div>
  
            <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
              <input
                type="password"
                className="form-control"
                placeholder="비밀번호"
                required
                name="password"
                value={userInput.password}
                onChange={handleUserInput} 
              />
            </div>
          </div>
  
          <div className="mt-2">
            {error && <p className="text-danger">{error}</p>}
            <button
              type="submit"
              className="btn btn-outline-success"
              style={{ width: "200px" }}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    )
}

export default Login;