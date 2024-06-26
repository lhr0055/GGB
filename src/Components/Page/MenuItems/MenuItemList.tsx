import React from 'react' // React 라이브러리를 불러옴
import { menuItemModel } from "../../../Interfaces"; // menuItemModel 인터페이스를 불러옴
import { useEffect, useState } from "react"; // useEffect와 useState 훅을 불러옴
import MenuItemCard from './MenuItemCard'; // MenuItemCard 컴포넌트를 불러옴
import { useDispatch } from 'react-redux'; // Redux의 useDispatch 훅을 불러옴
import { setMenuItem } from '../../../Storage/Redux/menuItemSlice'; // Redux 액션 setMenuItem을 불러옴
import { useGetMenuItemsQuery } from '../../../Apis/menuItemApi'; // useGetMenuItemsQuery 훅을 불러옴

function MenuItemList(){ // MenuItemList 함수형 컴포넌트를 정의

    //const [menuItem, setMenuItems] = useState<menuItemModel[]>([]); // 상태 관리용 useState 훅을 주석 처리함
    const dispatch = useDispatch(); // useDispatch 훅을 사용하여 dispatch 함수를 생성

    const {data, isLoading} = useGetMenuItemsQuery(null); // useGetMenuItemsQuery 훅을 사용하여 데이터와 로딩 상태를 가져옴

    useEffect(()=>{ // useEffect 훅을 사용하여 컴포넌트가 마운트될 때 실행할 동작을 정의
      if(!isLoading){ // 데이터 로딩이 완료된 경우
        dispatch(setMenuItem(data.result)); // Redux 액션을 디스패치하여 데이터를 상태로 설정
      }
    },[]); // 빈 배열을 두 번째 인자로 전달하여 컴포넌트가 처음 마운트될 때만 실행되도록 함

    if(isLoading){ // 데이터가 로딩 중인 경우
      return <div>Loading....</div> // 로딩 중임을 표시하는 메시지를 렌더링
    }

    return( // 컴포넌트의 반환값을 정의
        <div className='container row'> 
        {/* // container와 row 클래스가 적용된 div를 반환 */}
            {data.result.length > 0 && // 데이터가 존재하는 경우
            data.result.map((menuItem: menuItemModel, index: number)=>( // 데이터 배열을 순회하며 MenuItemCard 컴포넌트를 렌더링
              <MenuItemCard menuItem={menuItem} key={index}/> // 각 MenuItemCard 컴포넌트에 menuItem과 key를 전달
            ))}
        </div>
    )
}

export default MenuItemList; // MenuItemList 컴포넌트를 기본 내보내기(export)로 설정
