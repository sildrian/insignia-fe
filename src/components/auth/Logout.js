import React, { useEffect,useMemo,useState } from "react";
import { useNavigate } from 'react-router-dom';
import {useAuth} from '../../store/auth/authStore'
import {
    LOGIN_FAILED,
    LOGIN_STATUS
  } from '../../store/storeTypes'

const Logout = () => {
    const { dispatch } = useAuth();
    let navigate = useNavigate();

    useEffect( () => {
        isLogout()
      }, []);

    const isLogout = async () => {
        await dispatch({ type: LOGIN_FAILED, payload: {loginData: ''}});
        await dispatch({ type: LOGIN_STATUS, payload: {loginStatus: `false`}});
        navigate("/login");
    }

    return (
        <div>
        </div>
    );
};

export default Logout;