import {createGroupConstants} from './creatGroupTypes'
import {createGroupService} from '../../services/createGroupService'

export const CreateGroupAction ={
    getEmail,
    getName,
    createGroup,
}

function getEmail(typedEmail) {
    return (dispatch) => {
      dispatch(request());
  
      createGroupService.getEmail(typedEmail).then(
        (receivedEmails) => {
          dispatch(success(receivedEmails));
        },
        (error) => {
          dispatch(failure(error.toString()));
        }
      );
    };
    function request() {
        return { type: createGroupConstants.GETEMAIL_REQUEST };
      }
      function success(receivedEmails) {
        return { type: createGroupConstants.GETEMAIL_SUCCESS, receivedEmails };
      }
      function failure(error) {
        return { type: createGroupConstants.GETEMAIL_FAILURE, error };
      }
}
function getName(typedName) {
    return (dispatch) => {
      dispatch(request());
  
      createGroupService.getName(typedName).then(
        (receivedNames) => {
          dispatch(success(receivedNames));
        },
        (error) => {
          dispatch(failure(error.toString()));
        }
      );
    };
    function request() {
        return { type: createGroupConstants.GETNAME_REQUEST };
      }
      function success(receivedNames) {
        return { type: createGroupConstants.GETNAME_SUCCESS, receivedNames };
      }
      function failure(error) {
        return { type: createGroupConstants.GETNAME_FAILURE, error };
      }
}
function createGroup(groupData) {
    return (dispatch) => {
      dispatch(request());
  
      createGroupService.createGroup(groupData).then(
        (groupCreated) => {
          dispatch(success());
        },
        (error) => {
          dispatch(failure(error.toString()));
        }
      );
    };
    function request() {
        return { type: createGroupConstants.CREATEGROUP_REQUEST };
      }
      function success() {
        return { type: createGroupConstants.CREATEGROUP_SUCCESS };
      }
      function failure(error) {
        return { type: createGroupConstants.CREATEGROUP_FAILURE, error };
      }
}