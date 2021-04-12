import {dashboardConstants} from './dashboardTypes'
import {dashboardService} from '../../services/dashboardService'

export const DashboardAction = {
    currentUserDetails,
    getUserOweDetails,
    getUserGetBackDetails,
    getGroupForSettle,
    getPersonForSettle,
    settle,
  };
function currentUserDetails() {
    return (dispatch) => {
      dispatch(request());
  
      dashboardService.userDetails().then(
        (user) => {
          dispatch(success(user));
        },
        (error) => {
          dispatch(failure(error.toString()));
        }
      );
    };
    function request() {
        return { type: dashboardConstants.USERDETAILS_REQUEST };
      }
      function success(user) {
        return { type: dashboardConstants.USERDETAILS_SUCCESS, user };
      }
      function failure(error) {
        return { type: dashboardConstants.USERDETAILS_FAILURE, error };
      }
}
function getUserOweDetails() {
    return (dispatch) => {
      dispatch(request());
  
      dashboardService.userOweDetails().then(
        (userOwe) => {
          dispatch(success(userOwe));
        },
        (error) => {
          dispatch(failure(error.toString()));
        }
      );
    };
    function request() {
        return { type: dashboardConstants.USEROWE_REQUEST };
      }
      function success(userOwe) {
        return { type: dashboardConstants.USEROWE_SUCCESS, userOwe };
      }
      function failure(error) {
        return { type: dashboardConstants.USEROWE_FAILURE, error };
      }
}

function getUserGetBackDetails() {
    return (dispatch) => {
      dispatch(request());
  
      dashboardService.userGetBackDetails().then(
        (userGet) => {
          dispatch(success(userGet));
        },
        (error) => {
          dispatch(failure(error.toString()));
        }
      );
    };
    function request() {
        return { type: dashboardConstants.USERGETBACK_REQUEST };
      }
      function success(userGet) {
        return { type: dashboardConstants.USERGETBACK_SUCCESS, userGet };
      }
      function failure(error) {
        return { type: dashboardConstants.USERGETBACK_FAILURE, error };
      }
}

function getGroupForSettle(typedGroupName) {
    return (dispatch) => {
      dispatch(request());
  
      dashboardService.groupForSettle(typedGroupName).then(
        (groupNames) => {
          dispatch(success(groupNames));
        },
        (error) => {
          dispatch(failure(error.toString()));
        }
      );
    };
    function request() {
        return { type: dashboardConstants.GETGROUP_REQUEST };
      }
      function success(groupNames) {
        return { type: dashboardConstants.GETGROUP_SUCCESS, groupNames };
      }
      function failure(error) {
        return { type: dashboardConstants.GETGROUP_FAILURE, error };
      }
}

function getPersonForSettle(typedPersonName) {
    return (dispatch) => {
      dispatch(request());
  
      dashboardService.personForSettle(typedPersonName).then(
        (personNames) => {
          dispatch(success(personNames));
        },
        (error) => {
          dispatch(failure(error.toString()));
        }
      );
    };
    function request() {
        return { type: dashboardConstants.GETPERSON_REQUEST };
      }
      function success(personNames) {
        return { type: dashboardConstants.GETPERSON_SUCCESS, personNames };
      }
      function failure(error) {
        return { type: dashboardConstants.GETPERSON_FAILURE, error };
      }
}

function settle(data) {
    return (dispatch) => {
      dispatch(request());
  
      dashboardService.settle(data).then(
        (settle) => {
          dispatch(success(settle));
        },
        (error) => {
          dispatch(failure(error.toString()));
        }
      );
    };
    function request() {
        return { type: dashboardConstants.SETTLE_REQUEST };
      }
      function success(settle) {
        return { type: dashboardConstants.SETTLE_SUCCESS, settle};
      }
      function failure(error) {
        return { type: dashboardConstants.SETTLE_FAILURE, error };
      }
}