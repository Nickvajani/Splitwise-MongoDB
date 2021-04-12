import { groupConstants } from "./groupTypes";
import { groupService } from "../../services/groupService";

export const GroupsAction = {
  groupExpense,
  currentUserDetails,
  groupDetails,
  groupOweDetails,
  addExpense
};

function groupExpense(data) {
  return (dispatch) => {
    dispatch(request());

    groupService.groupExpense(data).then(
      (Obj) => {
        dispatch(success(Obj));
      },
      (error) => {
        dispatch(failure(error.toString()));
      }
    );
  };
  function request() {
    return { type: groupConstants.EXPENSE_REQUEST };
  }
  function success(Obj) {
    return { type: groupConstants.EXPENSE_SUCCESS, Obj };
  }
  function failure(error) {
    return { type: groupConstants.EXPENSE_FAILURE, error };
  }
}

function currentUserDetails() {
  return (dispatch) => {
    dispatch(request());

    groupService.userDetails().then(
      (user) => {
        dispatch(success(user));
      },
      (error) => {
        dispatch(failure(error.toString()));
      }
    );
  };
  function request() {
    return { type: groupConstants.USERDETAILS_REQUEST };
  }
  function success(user) {
    return { type: groupConstants.USERDETAILS_SUCCESS, user };
  }
  function failure(error) {
    return { type: groupConstants.USERDETAILS_FAILURE, error };
  }
}

function groupDetails(data) {
    return (dispatch) => {
      dispatch(request());
  
      groupService.groupDetails(data).then(
        (groupNameDetails) => {
          dispatch(success(groupNameDetails));
        },
        (error) => {
          dispatch(failure(error.toString()));
        }
      );
    };
    function request() {
      return { type: groupConstants.GROUPDETAILS_REQUEST };
    }
    function success(groupNameDetails) {
      return { type: groupConstants.GROUPDETAILS_SUCCESS, groupNameDetails };
    }
    function failure(error) {
      return { type: groupConstants.GROUPDETAILS_FAILURE, error };
    }
  }

  function groupOweDetails(data) {
    return (dispatch) => {
      dispatch(request());
  
      groupService.groupOweDetails(data).then(
        (owerObject) => {
          dispatch(success(owerObject));
        },
        (error) => {
          dispatch(failure(error.toString()));
        }
      );
    };
    function request() {
      return { type: groupConstants.OWE_REQUEST };
    }
    function success(owerObject) {
      return { type: groupConstants.OWE_SUCCESS, owerObject };
    }
    function failure(error) {
      return { type: groupConstants.OWE_FAILURE, error };
    }
  }
  
  function addExpense(data) {
    return (dispatch) => {
      dispatch(request());
  
      groupService.addExpense(data).then(
        (user) => {
          dispatch(success());
        },
        (error) => {
          dispatch(failure(error.toString()));
        }
      );
    };
    function request() {
      return { type: groupConstants.ADDEXPENSE_REQUEST };
    }
    function success() {
      return { type: groupConstants.ADDEXPENSE_SUCCESS };
    }
    function failure(error) {
      return { type: groupConstants.ADDEXPENSE_FAILURE, error };
    }
  }
