import { userConstants } from "./signupTypes";
import { userService } from "../../services/usersService";

export const signupAction = {
  register,
};

function register(user) {
  return (dispatch) => {
    dispatch(request(user));

    userService.register(user).then(
      user => {
        dispatch(success());
      },
      (error) => {
        dispatch(failure(error.toString()));
      }
    );
  };

  function request(user) {
    return { type: userConstants.REGISTER_REQUEST, user };
  }
  function success() {
      console.log('called success action')
    return { type: userConstants.REGISTER_SUCCESS };
  }
  function failure(error) {
    return { type: userConstants.REGISTER_FAILURE, error };
  }
}
