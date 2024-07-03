import React from "react";

const inputHelper = (
    e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >, //변경이벤트가 입력 요소에 대해 작동 
    
    data: any
) => {
    const tempData: any = {...data}; //data를 분산시키고 요소 이름을 기반으로 값 할당
    tempData[e.target.name] = e.target.value; //값을 임시 데이터로 저장하고 반환한다. 
    return tempData;
};


export default inputHelper;
// CartPicupDetail 입력값 이벤트를 매개변수로 수신받는다.(업데이트 시마다)
//이 헬퍼로 구성 요소를 옮기면 여러워치에서 재사용할 수 있다. 