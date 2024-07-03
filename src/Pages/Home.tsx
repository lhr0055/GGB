import React from "react";
import { MenuItemList } from "../Components/Page/Home";
import { Banner } from "../Components/Page/Common";

function Home(){
    return (
        <div>
            <Banner/>
            <div className="container p-2">
                <MenuItemList/>
            </div>
        </div>
    );
}
export default Home;