import React from "react";
 
function MiniLoader({type = "warning", size = 100}){ //매개변수 = "default"로 받아 동적으로 활용
    return (
        <div>
            <div
              className={`spinner-border text-${type}`} //추가중이면 로딩효과 
              style={{scale: `${size}%`}} 
            >
              {" "}
            </div>
        </div>
    );
}

export default MiniLoader;