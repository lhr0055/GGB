const withAuth = (WrappedComponent : any) => {
    return (props:any)=>{
        // console.log("HOC Called");
        const accessToken = localStorage.getItem("token"); //인증됨
        if(!accessToken){ //로그인 인증되지않으면 로그인으로 리디렉션 
            window.location.replace("/login");
            return null;
        }
        return <WrappedComponent {...props}/>;
    };
};
export default withAuth

//매개변수로 구성요소를 가져와 래핑된 구성요소 정의된 props로 반환한다.
//props를 ...으로 펼쳐서 반환한다. 
