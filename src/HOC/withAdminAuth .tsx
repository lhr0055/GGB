import jwt_decode from "jwt-decode";
import { SD_Roles } from "../Utility/SD";
//토근을 검사하고 추출하기위해 

const withAdminAuth  = (WrappedComponent : any) => {
    return (props:any)=>{
        // console.log("HOC Called");
        const accessToken = localStorage.getItem("token"); //인증됨

        if(accessToken) {
            const decode: {
                role: string;
            } = jwt_decode(accessToken);
        // 권한이 admin이 아닐경우 액세스 거부 
        if(decode.role !== SD_Roles.ADMIN){
            window.location.replace("/accessDenied");
            return null;
        }
    }
    else{ //토큰이 없으면 로그인페이지로 리디렉션 
        window.location.replace("/login");
        return null;
    } //해당 조건이 없으면 규칙은 유효한 값 반환 
        return <WrappedComponent {...props}/>;
    };
};
export default withAdminAuth 

//매개변수로 구성요소를 가져와 래핑된 구성요소 정의된 props로 반환한다.
//props를 ...으로 펼쳐서 반환한다. 
