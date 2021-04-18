import { combineReducers } from 'redux';
import {loginReducer} from './login/loginReducer'
import {registration} from './signup/signupReducer'
import {profileReducer} from './profilepage/ProfilePageReducer'
import {myGroupsReducer} from './mygroups/MyGroupsReducer'
import {groupReducer} from './group/groupReducer'
import {dashboardReducer} from  './dashboard/dashboardReducer'
import {recentActivityReducer} from './recentActivity/RecentActivityReducer'
import {createGroupReducer} from './createGroup/createGroupReducer'

const rootReducer = combineReducers({
    loginState: loginReducer,
    registerState: registration,
    getProfileState: profileReducer,
    myGroupsState: myGroupsReducer,
    groupState: groupReducer,
    dashboardState: dashboardReducer,
    recentActivityState: recentActivityReducer,
    createGroupState: createGroupReducer
  });
  
  export default rootReducer;