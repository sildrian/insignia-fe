import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
// import CheckButton from "react-validation/build/button";
import Toastt from "../notif/Toast";
// import Navbar from "./Navbar"
import {OnLogin} from '../../services/auth/authServices';
import {useAuth} from '../../store/auth/authStore';
import {
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGIN_STATUS
} from '../../store/storeTypes'

const Loginnew = () => {
    const { state,dispatch } = useAuth();

    let navigate = useNavigate();

    const form = useRef();
    // const checkBtn = useRef();

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
        <div className="container">
            <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                <div className="container">
                    <div className="row justify-content-center">
                    <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                        <div className="card mb-3">

                        <div className="card-body">

                            <div className="pt-4 pb-2">
                            <h5 className="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                            <p className="text-center small">Enter your username & password to login</p>
                            </div>

                            <Form className="row g-3 needs-validation" onSubmit={handleLogin} ref={form}>

                                <div className="col-12">
                                    <label className="form-label">Username</label>
                                    {/* <div className="input-group has-validation"> */}
                                    {/* <span className="input-group-text" id="inputGroupPrepend">@</span> */}
                                    <Input type="text" className="form-control" value={username} onChange={onChangeUsername} validations={[required]}></Input>
                                    <div className="invalid-feedback">Please enter your username.</div>
                                    {/* </div> */}
                                </div>

                                <div className="col-12">
                                    <label className="form-label">Password</label>
                                    <Input type="password" className="form-control" value={password} onChange={onChangePassword} validations={[required]}></Input>
                                    <div className="invalid-feedback">Please enter your password!</div>
                                </div>

                                <div className="col-12">
                                    <button className="btn btn-primary w-100" disabled={loading}>
                                    {loading && (
                                        <span className="spinner-border spinner-border-sm"></span>
                                    )}
                                    <span>Login</span>
                                    </button>
                                </div>
                            </Form>

                        </div>
                        </div>

                        {/* <div className="credits">
                            Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
                        </div> */}

                    </div>
                    </div>
                </div>

            </section>

            {
                msgToast && <Toastt msg={dataToast.msg} topMsg={dataToast.topMsg} coloor={dataToast.coloor}  />
            }

        </div>
    </div>
  )
}

export default Loginnew;