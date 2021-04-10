import { userConstants } from './signupTypes';

export function registration(state = {}, action){
  switch (action.type) {
    
    case userConstants.REGISTER_REQUEST:
      return { registering: true };
    case userConstants.REGISTER_SUCCESS:
      console.log("from SignupReducer"); 
    return {
        registeredFlag: true,
      };
    case userConstants.REGISTER_FAILURE:
      return {
        errorFlag: true
      };
    default:
      return state
  }
}

export default registration;