import React from 'react';
import {withAuth} from "../HOC";

function AuthenticationTest() {
    return(
        <div>This page can accessed by any logged in user</div>
    )
}


export default withAuth(AuthenticationTest);