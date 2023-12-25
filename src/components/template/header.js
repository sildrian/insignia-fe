import React, { useState, useEffect } from "react";
import { Link  } from "react-router-dom";
import { useAuth } from "../../store/auth/authStore";
import { OnGetUser } from "../../services/datas/transactionsService";

const Header = () => {
    const { state } = useAuth();
    const [tSidebar, setTSidebar] = useState(false);
    const [userData, setUserData] = useState({});

    useEffect(() => {
        if(tSidebar){
            document.body.classList.add('toggle-sidebar');
        }else{
            document.body.classList.remove('toggle-sidebar');
        }
    },[tSidebar])

    useEffect(()=>{
        OnGetUser({token: state.loginData?.token})
        .then(
          (response) => {
            if(response?.status === 200 && typeof(response.data) !== "undefined"){
                setUserData(response.data)
            }
        })
    },[])

    return (
        <div>
            <header id="header" className="header fixed-top d-flex align-items-center">

                <div className="d-flex align-items-center justify-content-between">
                    <div style={{cursor:"pointer"}} onClick={()=>{window.location.reload()}} className="logo d-flex align-items-center">
                        <img src={'/assets/img/logo.png'}></img>
                        <span className="d-none d-lg-block">NiceAdmin</span>
                    </div>
                    <i onClick={() => tSidebar === false ? setTSidebar(true) : setTSidebar(false)} className="bi bi-list toggle-sidebar-btn"></i>
                </div>

                <nav className="header-nav ms-auto">
                    <ul className="d-flex align-items-center">

                        <li className="nav-item dropdown pe-3">

                            <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                                <img src={'/assets/img/profile-img.jpg'} alt="Profile" className="rounded-circle"></img>
                                <span className="d-none d-md-block dropdown-toggle ps-2">{typeof(userData.username) !== "undefined" ? userData.username : ""}</span>
                            </a>

                            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                                <li className="dropdown-header">
                                <h6>{typeof(userData.username) !== "undefined" ? userData.username : ""}</h6>
                                <span>People</span>
                                </li>
                                <li>
                                <hr className="dropdown-divider"></hr>
                                </li>

                                <li>
                                <Link to={"/logout"} className="dropdown-item d-flex align-items-center" >
                                    <i className="bi bi-box-arrow-right"></i>
                                    <span>Logout</span>
                                </Link>
                                </li>

                            </ul>
                        </li>
                    </ul>
                </nav>
            </header>
        </div>
    )

}

export default Header;