import React from "react";
import { Routes, Route  } from "react-router-dom";
import Dashboard from "../components/home/dashboard";
import Authenticated from '../middleware/Authenticated'
// import Login from '../components/auth/Login';
import Loginnew from "../components/auth/Loginnew";
// import Detail from "../components/Detail";
import Logout from '../components/auth/Logout'
import Showme from "../components/home/showme";

const NavigationStacks = () => {

  return (
      <div>
        <div>
          <Routes>
              <Route path="/login" element={<Loginnew/>}></Route> 
              <Route path="/logout" element={<Logout/>}></Route> 
              
              <Route path="/" element={
                <Authenticated>
                  <Dashboard />
                  {/* <Showme /> */}
                </Authenticated>
              }></Route>
              {/* <Route path="/detail" element={
                <Authenticated>
                  <Detail />
                </Authenticated>
              }></Route> */}
          </Routes>
        </div>
      </div>
  );
}

export default NavigationStacks;