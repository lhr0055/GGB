import React, { useEffect } from "react";

function NotFound () {
    let img = require("../Assets/Images/not.png");

    return(
        <div>   
            <h3>NotFound</h3> 
            <h1>Kimchi is an ingredient for cooking </h1>
            <img src={img} alt="404" width="25%"/>  
        </div>
    )
}

export default NotFound;