import axiosInstance from "../helpers/axios";

export const myGroupsService = {
  getJoinedGroups,
  getInvitedGroups,
  getGroups,
  joinGroup,
  leaveGroup,
};

async function getJoinedGroups() {
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));

  const response = await axiosInstance
    .get("/mygroups/joined", {
      headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
    })
    .then((response) => {
      var joinedGroups = {
        groupNames: response.data,
      };
      return joinedGroups;
    });
  return response;
}
async function getInvitedGroups() {
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));

  const response = await axiosInstance
    .get("/mygroups/invites", {
      headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
    })
    .then((response) => {
      var invitedGroups = {
        invitedGroups: response.data,
      };
      return invitedGroups;
    });
  return response;
}
async function getGroups(typedGroupName) {
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));

  const response = await axiosInstance
    .post("/mygroups/getGroups", typedGroupName, {
      headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
    })
    .then((response) => {
      var joinedGroupNamesObj = {
        joinedGroupNames: response.data,
      };
      return joinedGroupNamesObj;
    });
  return response;
}
async function joinGroup(idvalue) {
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));

  const response = await axiosInstance
    .put("/mygroups/" + idvalue + "/accept", null, {
      headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
    })
    .then((response) => {
      var names = {
        joinedGroupNames: [],
      };
      return names;
    });
  return response;
}
async function leaveGroup(data) {
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));

  const response = await axiosInstance
    .delete("/mygroups/leave/" + data.g_id, {
      headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
    })
    .then((response) => {
      let user = {
        successMessage: "Group left!!",
      };
      return user
    });
    return response
}
