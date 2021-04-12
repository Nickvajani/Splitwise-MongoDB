import {recentActivityConstants} from './RecentActivityTypes'

export function recentActivityReducer(state = [] ,action){
    switch(action.type){
        case recentActivityConstants.USERDETAILS_REQUEST:
            return state;
          case recentActivityConstants.USERDETAILS_SUCCESS:
            return {
              user: action.user,
            };
          case recentActivityConstants.USERDETAILS_FAILURE:
            return state;
        
        
            case recentActivityConstants.RECENTACTIVITY_REQUEST:
                return state;
              case recentActivityConstants.RECENTACTIVITY_SUCCESS:
                return {
                  recentActivity: action.recentActivity,
                };
              case recentActivityConstants.RECENTACTIVITY_FAILURE:
                return state;

                
        default:
        return state
    }
}