import React from 'react';

let pamplete1 = require("../../../Assets/Images/001.png");
let pamplete2 = require("../../../Assets/Images/002.png");

function MenuDetail() {
    return (
        <div>
            <img width={'80%'} src={pamplete1} alt="Logo"/>
            <img width={'80%'} src={pamplete2} alt="Logo"/>
        </div>
    );


}

export default MenuDetail;