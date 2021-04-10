import { combineReducers } from 'redux';
import {loginReducer} from './login/loginReducer'
import {registration} from './signup/signupReducer'
import {profileReducer} from './profilepage/ProfilePageReducer'


const rootReducer = combineReducers({
    loginState: loginReducer,
    registerState: registration,
    getProfileState: profileReducer
    
  });
  
  export default rootReducer;