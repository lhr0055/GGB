import React, {useEffect} from "react";
import {menuItemModel} from "../../../Interfaces";
import MenuItemCard from "./MenuItemCard";
import { useGetMenuItemsQuery} from "../../../Apis/menuItemApi";
import { useDispatch} from "react-redux";
import {setMenuItem} from "../../../Storage/Redux/menuItemSlice";
import {MainLoader} from "../Common";

function MenuItemList() {
    // const [menuItems, setMenuItems] = useState<menuItemModel[]>([]);
    const dispatch = useDispatch();
    const { data, isLoading } = useGetMenuItemsQuery(null);


    useEffect(() => {
        if(!isLoading) {
        dispatch(setMenuItem(data.result));

        }
    }, [isLoading]);


    if(isLoading) {
        return <MainLoader/>;
    }

    return (
        <div className="container row">
            {data.result.length > 0 &&
                data.result.map((item : menuItemModel, index : number) => (
                    <MenuItemCard menuitem={item} key={index}/>
                ))}
        </div>
    );
}


export default MenuItemList;