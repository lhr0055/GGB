import jwt_decode from "jwt-decode";
import {SD_Roles} from "../Utility/SD";



const withAdminAuth = (WrappedComponent : any) => {
    return(props: any) => {

        const accessToken = localStorage.getItem("token") ?? ""; // 토큰이 있는지 확인
        if(accessToken) {
            const decode: {
                role: string;
            } = jwt_decode(accessToken);


            if(decode.role!==SD_Roles.ADMIN) {
                window.location.replace("/accessDenied");
                return null;

            }

            }

        else { // 토큰이 없으면 login 화면으로 되돌리기
            window.location.replace("/login");
            return null;
        }


        return <WrappedComponent {...props}/>


    }
}

export default withAdminAuth;