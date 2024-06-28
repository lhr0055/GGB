const withAuth = (WrappedComponent : any) => {
    return(props: any) => {
        console.log("HOC called");
        const accessToken = localStorage.getItem("token"); // 토큰이 있는지 확인
        if(!accessToken){ // 토큰이 없으면 login 화면으로 되돌리기
            window.location.replace("/login");
            return null;
        }
        return <WrappedComponent {...props}/>


    }
}

export default withAuth;