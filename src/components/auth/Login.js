import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import Toastt from "../notif/Toast"
// import Navbar from "./Navbar"
import {OnLogin} from '../../services/auth/authServices'
import {useAuth} from '../../store/auth/authStore'
import {
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGIN_STATUS
} from '../../store/storeTypes'

const Login = () => {
    const { state,dispatch } = useAuth();

    let navigate = useNavigate();

    const form = useRef();
    const checkBtn = useRef();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [notifInfo, setNotifInfo] = useState(false);
    const [msgToast, setMsgToast] = useState(false);
    const [dataToast, setDataToast] = useState({msg:'',topMsg:'',coloor:''});


    const required = (value) => {
        if (!value) {
          return (
            <div className="alert alert-danger" role="alert">
              This field is required!
            </div>
          );
        }
    };

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };
    
    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };
    
    const handleLogin = (e) => {
        e.preventDefault();
    
        setMessage("");
        setLoading(true);
        setMsgToast(false)
    
        // form.current.validateAll();
    
        // if (checkBtn.current.context._errors.length === 0) {
    
        OnLogin({username, password})
        .then(
        async (response) => {
            if(response.status === 200){
              isLoginSuccess(response)
              navigate("/");
            }else{
              isLoginFailed(response)
            }
            setLoading(false);
        },
        (error) => {
            const resMessage =
            (error.response &&
                error.response.data &&
                error.response.data.message) ||
            error.message ||
            error.toString();

            isLoginFailed(error.response)

            setLoading(false);
            setMessage(resMessage);
        }
        )
        .catch((e) =>
            // dispatch(ActionCreators.onLoginFailed(e))
            console.log(`${e}`)
        );
    };

    const isLoginSuccess = async (response) => {
      await dispatch({ type: LOGIN_SUCCESS, payload: {loginData: response.data}} );
      await dispatch({ type: LOGIN_STATUS, payload: {loginStatus: `true`} });
    }

    const isLoginFailed = async (response) => {
      await dispatch({ type: LOGIN_FAILED, payload: {loginData: ''}});
      await dispatch({ type: LOGIN_STATUS, payload: {loginStatus: `false`}});
      setDataToast({msg:`${response.message}`,topMsg:`${response.code}`,coloor:'red'})
      setMsgToast(true)
    }


  return (
    <div>
      {/* <Navbar /> */}
      <div className="col-md-12 d-flex justify-content-center align-items-center mt-5">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />

          <Form onSubmit={handleLogin} ref={form}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Input
                type="text"
                className="form-control"
                name="username"
                value={username}
                onChange={onChangeUsername}
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Input
                type="password"
                className="form-control"
                name="password"
                value={password}
                onChange={onChangePassword}
                validations={[required]}
              />
            </div>

            <div className="form-group">
              <button className="btn btn-primary btn-block" disabled={loading}>
                {loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div>

            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
            <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>
        </div>
          
        {
          msgToast && <Toastt msg={dataToast.msg} topMsg={dataToast.topMsg} coloor={dataToast.coloor}  />
        }
        

      </div>
    </div>
  );
};

export default Login;