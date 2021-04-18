import { createGroupConstants } from "./creatGroupTypes";

export function createGroupReducer(state = [], action) {
  switch (action.type) {
    case createGroupConstants.GETEMAIL_REQUEST:
      return state;
    case createGroupConstants.GETEMAIL_SUCCESS:
      return {
          receivedEmails : action.receivedEmails
      }
    case createGroupConstants.GETEMAIL_FAILURE:
      return state;

      case createGroupConstants.GETNAME_REQUEST:
        return state;
      case createGroupConstants.GETNAME_SUCCESS:
        return {
            receivedNames : action.receivedNames
        }
      case createGroupConstants.GETNAME_FAILURE:
        return state;

        case createGroupConstants.CREATEGROUP_REQUEST:
        return state;
      case createGroupConstants.CREATEGROUP_SUCCESS:
        return {
            groupCreateFlag: true,
        }
      case createGroupConstants.CREATEGROUP_FAILURE:
        return {
            errorFlag: true
        }
    default:
      return state;
  }
}
