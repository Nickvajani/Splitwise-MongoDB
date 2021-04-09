import { profileConstants } from "./ProfilePageTypes";

let user = JSON.parse(localStorage.getItem("user"));
const initialState = user ? { loggedIn: true, user } : {};

export function profileReducer(state = initialState, action) {
  switch (action.type) {
    case profileConstants.PROFILE_REQUEST:
      return {
        user: action.user,
      };
    case profileConstants.PROFILE_FAILURE:
      return {
        errorFlag: true,
      };
    case profileConstants.PROFILE_SUCCESS:
      return {
        user: action.user,
      };
    case profileConstants.UPDATE_REQUEST:
      return state;
    case profileConstants.UPDATE_FAILURE:
      return {
        errorFlag: true,
      };
    case profileConstants.UPDATE_SUCCESS:
      console.log(action);
      return {
        profileUpdated: true,
        redirectF: true,
        user: action.user.data,
      };

    default:
      console.log("default reducer s");
      return state;
  }
}
