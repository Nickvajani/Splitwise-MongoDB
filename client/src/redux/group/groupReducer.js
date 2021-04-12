import { groupConstants } from "./groupTypes";

export function groupReducer(state = [], action) {
  switch (action.type) {
    case groupConstants.EXPENSE_REQUEST:
      return state;
    case groupConstants.EXPENSE_SUCCESS:
      return{
          Obj:action.Obj
      };
    case groupConstants.EXPENSE_FAILURE:
      return state;
     
     
      case groupConstants.USERDETAILS_REQUEST:
        return state;
      case groupConstants.USERDETAILS_SUCCESS:
        return{
            user : action.user
        };
      case groupConstants.USERDETAILS_FAILURE:
        return state;


        case groupConstants.GROUPDETAILS_REQUEST:
            return state;
          case groupConstants.GROUPDETAILS_SUCCESS:
            return{
                groupNameDetails : action.groupNameDetails
            };
          case groupConstants.GROUPDETAILS_FAILURE:
            return state;


            case groupConstants.OWE_REQUEST:
                return state;
              case groupConstants.OWE_SUCCESS:
                return{
                    oweObject : action.owerObject
                };
              case groupConstants.OWE_FAILURE:
                return state;


                case groupConstants.ADDEXPENSE_REQUEST:
                return state;
              case groupConstants.ADDEXPENSE_SUCCESS:
                return{
                    insertFlag: true,
                
                };
              case groupConstants.ADDEXPENSE_FAILURE:
                return {
                    errorFlag: true
                }
    default:
      return state;
  }
}
