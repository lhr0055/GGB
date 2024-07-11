import React, { useState } from "react";
import { SD_Roles } from "../Utility/SD";
import { inputHelper, toastNotify } from "../Helper";
import { useRegisterUserMutation } from "../Apis/authApi";
import { apiResponse } from "../Interfaces";
import { useNavigate } from "react-router-dom";
import { MainLoader } from "../Components/Page/Common";

function Register() { //입력필드 
  const[registerUser] = useRegisterUserMutation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userInput, setuserInput] = useState({ 
    userName: "", //name="userName "
    password: "",
    role: "",
    name: "",
  });
//드롭다운 & 선택 이벤트 발생 시 (발생 이벤트 엘리먼트는 헬퍼에 등록해줘야함)
  const handleUserInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const tempData = inputHelper(e, userInput) //임시데이터에 입력값헬퍼로 전달한다. 
    setuserInput(tempData);//임시데이터로 입력값을 전달한다.(입력받을 수 있게함))
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setLoading(true); //로딩되는동안 일어나야 할 일들 
  const response : apiResponse = await registerUser({
    userName: userInput.userName, 
    password: userInput.password,
    role: userInput.role,
    name: userInput.name,
  });
  if(response.data){
    toastNotify("Registeration sucessful! Please login to continue.");
    navigate('/login');
  }else if(response.error){
    toastNotify(response.error.data.errorMessages[0],"error");
  }
  setLoading(false) //정보가 가져와지면 로딩 false 
};



    return (
        <div className="container text-center">
          {loading && <MainLoader/>}
        <form method="post" onSubmit={handleSubmit}>
          <h1 className="mt-5">Register</h1>
          <div className="mt-5">
            <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Username"
                required
                name="userName"
                value={userInput.userName}
                onChange={handleUserInput}
              />
            </div>
            <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Name"
                required
                name="name"
                value={userInput.name}
                onChange={handleUserInput}
              />
            </div>
            <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
              <input
                type="password"
                className="form-control"
                placeholder="Enter Password"
                required
                name="password"
                value={userInput.password}
                onChange={handleUserInput}
              />
            </div>
            <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
              <select 
                className="form-control form-select" 
                required
                name="role"
                value={userInput.role}
                onChange={handleUserInput}
                >
                <option value="">--Select Role--</option>
                <option value={`${SD_Roles.CUSTOMER}`}>Customer</option>
                <option value={`${SD_Roles.ADMIN}`}>Admin</option>
              </select>
            </div>
          </div>
          <div className="mt-5">
            <button type="submit" className="btn btn-outline-success" disabled={loading}>
              Register
            </button>
          </div>
        </form>
      </div>
    )
}

export default Register;

//스니펫 ui 