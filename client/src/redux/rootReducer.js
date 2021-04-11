import { combineReducers } from 'redux';
import {loginReducer} from './login/loginReducer'
import {registration} from './signup/signupReducer'
import {profileReducer} from './profilepage/ProfilePageReducer'
import {myGroupsReducer} from './mygroups/MyGroupsReducer'

const rootReducer = combineReducers({
    loginState: loginReducer,
    registerState: registration,
    getProfileState: profileReducer,
    myGroupsState: myGroupsReducer
  });
  
  export default rootReducer;