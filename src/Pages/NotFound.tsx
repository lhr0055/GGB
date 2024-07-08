import React, { useEffect } from "react";

function NotFound () {
    let img = require("../Assets/Images/not.png");

    return(
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                margin:"50px"
            }}>   
            {/* <h3>NotFound</h3> 
            <h1>Kimchi is an ingredient for cooking </h1> */}
            <img src={img} alt="404" width="60%"/>  
        </div>
    )
}

export default NotFound;