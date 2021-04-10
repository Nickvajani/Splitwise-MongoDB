import { userConstants } from "./loginTypes";
import { userService } from "../../services/usersService";

export const loginAction = {
  login,
};

function login(email, password) {
  return (dispatch) => {
    dispatch(request({ email, password }));

    userService.login(email, password).then(
      (user) => {
        dispatch(success(user));
      },
      (error) => {
        dispatch(failure(error.toString()));
      }
    );
  };
  function request(user) {
    console.log("returning from action")
    return { type: userConstants.LOGIN_REQUEST, user };
  }
  function success(user) {
    console.log("called success function");
    return { type: userConstants.LOGIN_SUCCESS, user };
  }
  function failure(error) {
    console.log("called failure function");
    return { type: userConstants.LOGIN_FAILURE, error };
  }
}

// import {
//     LOGIN_FAILURE,
//     LOGIN_REQUEST,
//     LOGIN_SUCCESS,
//     LOGOUT_REQUEST,
//     LOGOUT_RESPONSE,
// } from './loginTypes';

// export const loginRequest = (username, password) => {
//     return {
//         type: LOGIN_REQUEST,
//         payload: { username, password },
//     };
// };

// export const loginSuccess = (message) => {
//     return {
//         type: LOGIN_SUCCESS,
//         payload: { message },
//     };
// };

// export const loginFailure = (message) => {
//     return {
//         type: LOGIN_FAILURE,
//         payload: { message },
//     };
// };

// export const logoutRequest = () => {
//     return {
//         type: LOGOUT_REQUEST,
//     };
// };

// export const logoutResponse = (message) => {
//     return {
//         type: LOGOUT_RESPONSE,
//         payload: { message },
//     };
// };
