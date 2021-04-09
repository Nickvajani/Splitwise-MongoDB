import { userConstants } from "./loginTypes";

let user = JSON.parse(localStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user } : {};

export function loginReducer(state = initialState, action) {
  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
    console.log("from reducer LOGIN_REQUEST ") 
    return {
        loggingIn: true,
        user: action.user,
      };
    case userConstants.LOGIN_FAILURE:
      return {
        errorFlag: true
      };
    case userConstants.LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user,
      };
    default:
      return state;
  }
};