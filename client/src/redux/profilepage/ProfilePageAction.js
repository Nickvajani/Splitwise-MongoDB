import {profileConstants} from './ProfilePageTypes'
import {myProfileService} from '../../services/myProfileService'

export const ProfilePageAction ={
    getProfile,
    setProfile
}

function getProfile(data){
    return (dispatch) => {
        dispatch(request(data))

        myProfileService.getProfile(data).then(
            (user) => {
                dispatch(success(user))
            },
            (error) => {
                dispatch(failure(error.toString()));
              }
        )
    }
    function request(user) {
        console.log("returning from action")
        return { type: profileConstants.PROFILE_REQUEST, user };
      }
      function success(user) {
        return { type: profileConstants.PROFILE_SUCCESS, user };
      }
      function failure(error) {
        console.log("called failure function");
        return { type: profileConstants.PROFILE_FAILURE, error };
      }
}

function setProfile(userData){
    return (dispatch) => {
        dispatch(request(userData));
    
        myProfileService.setProfile(userData).then(
          user => {
            dispatch(success(user));
          },
          (error) => {
            dispatch(failure(error.toString()));
          }
        );
      };
    
      function request(user) {
        return { type: profileConstants.UPDATE_REQUEST, user };
      }
      function success(user) {
          console.log('called success action')
        return { type: profileConstants.UPDATE_SUCCESS, user };
      }
      function failure(error) {
        return { type: profileConstants.UPDATE_FAILURE, error };
      }
}