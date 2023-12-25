import React, { createContext, useReducer, useContext } from 'react';
import {
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGIN_STATUS
} from '../storeTypes'

// Create the context
const AuthContext = createContext();

// Initial state
const initialState = {
  loginData: localStorage.getItem("dataLogin") !== '' ? JSON.parse(localStorage.getItem("dataLogin")) : '',
  loginStatus: (typeof(localStorage.getItem("statusLogin")) !== 'undefined') && (localStorage.getItem("statusLogin") !== 'false') ? true : false
};

// Define the reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      localStorage.setItem("dataLogin", JSON.stringify(action.payload.loginData));
      localStorage.setItem("statusLogin", 'true');
      state.loginData = action.payload.loginData
      return state
    case LOGIN_FAILED:
      localStorage.setItem("dataLogin", ``);
      localStorage.setItem("statusLogin", 'false');
      state.loginData = action.payload.loginData
      return state
    case LOGIN_STATUS:
      state.loginStatus = action.payload.loginStatus === 'true' ?  true : false
      // state.loginStatus = statusLogin === 'true' ?  true : state.loginStatus//not used
      return state
    default:
      return state;
  }
  
};

// Create a custom provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    authReducer, 
    initialState
  );
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for accessing the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useCounter must be used within a CounterProvider');
  }
  return context;
};