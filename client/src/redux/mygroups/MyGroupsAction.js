import { myGroupsConstants } from "./MyGroupsTypes";
import { myGroupsService } from "../../services/myGroupsService";

export const MyGroupsAction = {
  joinedGroups,
  invitedGroups,
  getGroups,
  joinGroup,
  leaveGroup,
};

function joinedGroups() {
  return (dispatch) => {
    dispatch(request());

    myGroupsService.getJoinedGroups().then(
      (joinedGroups) => {
        dispatch(success(joinedGroups));
      },
      (error) => {
        dispatch(failure(error.toString()));
      }
    );
  };
  function request() {
    return { type: myGroupsConstants.JOINEDGROUPS_REQUEST };
  }
  function success(joinedGroups) {
    return { type: myGroupsConstants.JOINEDGROUPS_SUCCESS, joinedGroups };
  }
  function failure(error) {
    return { type: myGroupsConstants.JOINEDGROUPS_FAILURE, error };
  }
}
function invitedGroups() {
  return (dispatch) => {
    dispatch(request());

    myGroupsService.getInvitedGroups().then(
      (invitedGroups) => {
        dispatch(success(invitedGroups));
      },
      (error) => {
        dispatch(failure(error.toString()));
      }
    );
  };
  function request() {
    return { type: myGroupsConstants.INVITES_REQUEST };
  }
  function success(invitedGroups) {
    return { type: myGroupsConstants.INVITES_SUCCESS, invitedGroups };
  }
  function failure(error) {
    return { type: myGroupsConstants.INVITES_FAILURE, error };
  }
}
function getGroups(typedGroupName) {
  return (dispatch) => {
    dispatch(request());

    myGroupsService.getGroups(typedGroupName).then(
      (joinedGroupNamesObj) => {
        dispatch(success(joinedGroupNamesObj));
      },
      (error) => {
        dispatch(failure(error.toString()));
      }
    );
  };
  function request() {
    return { type: myGroupsConstants.GETGROUPS_REQUEST };
  }
  function success(joinedGroupNamesObj) {
    return { type: myGroupsConstants.GETGROUPS_SUCCESS, joinedGroupNamesObj };
  }
  function failure(error) {
    return { type: myGroupsConstants.GETGROUPS_FAILURE, error };
  }
}
function joinGroup(idvalue) {
  return (dispatch) => {
    dispatch(request());

    myGroupsService.joinGroup(idvalue).then(
      (names) => {
        dispatch(success(names));
      },
      (error) => {
        dispatch(failure(error.toString()));
      }
    );
  };
  function request() {
    return { type: myGroupsConstants.JOINGROUP_REQUEST };
  }
  function success(names) {
    return { type: myGroupsConstants.JOINGROUP_SUCCESS, names };
  }
  function failure(error) {
    return { type: myGroupsConstants.JOINGROUP_FAILURE, error };
  }
}
function leaveGroup(data) {
    return (dispatch) => {
      dispatch(request());
  
      myGroupsService.leaveGroup(data).then(
        (user) => {
          dispatch(success());
        },
        (error) => {
          dispatch(failure(error.toString()));
        }
      );
    };
    function request() {
      return { type: myGroupsConstants.LEAVEGROUP_REQUEST };
    }
    function success() {
      return { type: myGroupsConstants.LEAVEGROUP_SUCCESS };
    }
    function failure(error) {
      return { type: myGroupsConstants.LEAVEGROUP_FAILURE, error };
    }
  }
  