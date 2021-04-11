import { myGroupsConstants } from "./MyGroupsTypes";

export function myGroupsReducer(state = [], action) {
  switch (action.type) {
    case myGroupsConstants.JOINEDGROUPS_REQUEST:
      return state;
    case myGroupsConstants.JOINEDGROUPS_SUCCESS:
      return {
        joinedGroups: action.joinedGroups,
      };
    case myGroupsConstants.JOINEDGROUPS_FAILURE:
      return state;
    case myGroupsConstants.INVITES_REQUEST:
      return state;
    case myGroupsConstants.INVITES_SUCCESS:
      return {
        invitedGroups: action.invitedGroups,
      };
    case myGroupsConstants.INVITES_FAILURE:
      return state;

    case myGroupsConstants.GETGROUPS_REQUEST:
      return state;
    case myGroupsConstants.GETGROUPS_SUCCESS:
      return {
        joinedGroupNamesObj: action.joinedGroupNamesObj,
      };
    case myGroupsConstants.GETGROUPS_FAILURE:
      return state;

    case myGroupsConstants.JOINGROUP_REQUEST:
      return state;
    case myGroupsConstants.JOINGROUP_SUCCESS:
      return {
        names: action.names,
      }
    case myGroupsConstants.JOINGROUP_FAILURE:
      return state;

    default:
      return state;
  }
}
