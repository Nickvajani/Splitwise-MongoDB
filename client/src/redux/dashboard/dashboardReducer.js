import { dashboardConstants } from "./dashboardTypes";

export function dashboardReducer(state = [], action) {
  switch (action.type) {
    case dashboardConstants.USERDETAILS_REQUEST:
      return state;
    case dashboardConstants.USERDETAILS_SUCCESS:
      return {
        user: action.user,
      };
    case dashboardConstants.USERDETAILS_FAILURE:
      return state;

    case dashboardConstants.USEROWE_REQUEST:
      return state;
    case dashboardConstants.USEROWE_SUCCESS:
      return {
        userOwe: action.userOwe,
      };
    case dashboardConstants.USEROWE_FAILURE:
      return state;

    case dashboardConstants.USERGETBACK_REQUEST:
      return state;
    case dashboardConstants.USERGETBACK_SUCCESS:
      return {
        userGet: action.userGet,
      };
    case dashboardConstants.USERGETBACK_FAILURE:
      return state;

    case dashboardConstants.GETGROUP_REQUEST:
      return state;
    case dashboardConstants.GETGROUP_SUCCESS:
      return {
        groupNames: action.groupNames,
      };
    case dashboardConstants.GETGROUP_FAILURE:
      return state;

    case dashboardConstants.GETPERSON_REQUEST:
      return state;
    case dashboardConstants.GETPERSON_SUCCESS:
      return {
        personNames: action.personNames,
      };
    case dashboardConstants.GETPERSON_FAILURE:
      return state;

      case dashboardConstants.SETTLE_REQUEST:
        return state;
      case dashboardConstants.SETTLE_SUCCESS:
        return {
            settledFlag: true,
          settle: action.settle,
        };
      case dashboardConstants.SETTLE_FAILURE:
        return {notSettledFlag: true};
  
    default:
      return state;
  }
}
