import { recentActivityConstants } from "./RecentActivityTypes";
import { recentActivityService } from "../../services/recentActivityService";

export const RecentActivityAction = {
  currentUserDetails,
  getRecentActivity
};
function currentUserDetails() {
  return (dispatch) => {
    dispatch(request());

    recentActivityService.userDetails().then(
      (user) => {
        dispatch(success(user));
      },
      (error) => {
        dispatch(failure(error.toString()));
      }
    );
  };
  function request() {
    return { type: recentActivityConstants.USERDETAILS_REQUEST };
  }
  function success(user) {
    return { type: recentActivityConstants.USERDETAILS_SUCCESS, user };
  }
  function failure(error) {
    return { type: recentActivityConstants.USERDETAILS_FAILURE, error };
  }
}
function getRecentActivity() {
    return (dispatch) => {
      dispatch(request());
  
      recentActivityService.recentActivity().then(
        (recentActivity) => {
          dispatch(success(recentActivity));
        },
        (error) => {
          dispatch(failure(error.toString()));
        }
      );
    };
    function request() {
      return { type: recentActivityConstants.RECENTACTIVITY_REQUEST };
    }
    function success(recentActivity) {
      return { type: recentActivityConstants.RECENTACTIVITY_SUCCESS, recentActivity };
    }
    function failure(error) {
      return { type: recentActivityConstants.RECENTACTIVITY_FAILURE, error };
    }
  }
  