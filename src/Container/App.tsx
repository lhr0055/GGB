import React from "react";
import {Footer, Header} from "../Components/Layout";
import { Home, MenuItemDetails, NotFound } from "../Pages";
import { Routes, Route } from "react-router-dom";


function App() {
 


  return (
    <div>
      <Header/>
      <div className="pb-5">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menuItemDetails/:menuItemId" element={<MenuItemDetails />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
      </div>
      <Footer/>
    </div>
  )
}

export default App;
