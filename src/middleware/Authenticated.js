import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {useAuth} from '../store/auth/authStore'

const Authenticated = ({ children }) => {
    let navigate = useNavigate();
    const { state } = useAuth();
    useEffect(() => {
      if(state?.loginStatus === false){
        return navigate("/login");
      }
    }, [state]);
    return children;
  };

export default Authenticated