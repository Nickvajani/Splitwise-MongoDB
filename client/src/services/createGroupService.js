import axiosInstance from "../helpers/axios";

export const createGroupService = {
    getName,
    getEmail,
    createGroup
}

async function getName(typedName){

    axiosInstance.defaults.withCredentials = true;
    axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));
    const response = axiosInstance
      .post("/creategroup/getName", typedName)
      .then((response) => {
          let receivedNames ={
              result: response.data
          }

          return receivedNames
      });
      return response
}

async function getEmail(typedEmail){

    axiosInstance.defaults.withCredentials = true;
    axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));
    const response = axiosInstance
      .post("/creategroup/getEmail", typedEmail)
      .then((response) => {
          let receivedEmails ={
              results2: response.data
          }
          return receivedEmails
      });
      return response

}

async function createGroup(groupData){
    axiosInstance.defaults.withCredentials = true;
    axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));
    const response = axiosInstance
      .post("/creategroup", groupData, {
        headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
      })
      .then((response) => {
        let groupCreated ={
            groupCreatedMessage: response.data.msg
        }
        return groupCreated
        // this.setState({
        //   groupCreatedMessage: response.data.msg,
        //   groupCreateFlag: true,
        //   redirectF: true,
        // });
      })
      return response
}
