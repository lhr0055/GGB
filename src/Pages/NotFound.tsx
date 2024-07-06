import React, { useEffect } from "react";

function NotFound () {
    let gif = require("../Assets/Images/korea.gif");

    return(
        <div>   
            <h3>NotFound</h3> 
            <h1>Kimchi is an ingredient for cooking </h1>
            <img src={gif} alt="404" width="25%"/>  
        </div>
    )
}

export default NotFound;