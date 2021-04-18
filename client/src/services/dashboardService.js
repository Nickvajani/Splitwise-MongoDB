import axiosInstance from "../helpers/axios";

export const dashboardService = {
  userDetails,
  userOweDetails,
  userGetBackDetails,
  groupForSettle,
  personForSettle,
  settle,
};

async function userDetails() {
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));
  const response = await axiosInstance
    .get("/groups/userDetails", {
      headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
    })
    .then((response) => {
      let user = {
        userDefaultCurrency: response.data.default_currency,
      };
      return user;
    });
  return response;
}

async function userOweDetails() {
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));

  const response = await axiosInstance
    .get("/dashboard/getTotalOwe", {
      headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
    })
    .then((response) => {
      let userOwe = {
        userTotalOwe: response.data.owedAmount,
      };
      return userOwe;
    });
  return response;
}

async function userGetBackDetails() {
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));

  const response = await axiosInstance
    .get("/dashboard/getTotalGet", {
      headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
    })
    .then((response) => {
      let userGet = {
        userTotalGet: response.data.GetBackAmount,
      };
      return userGet;
    });
  return response;
}

async function groupForSettle(typedGroupName) {
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));

  const response = await axiosInstance
    .post("/mygroups/getGroups", typedGroupName, {
      headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
    })
    .then((response) => {
      let groupNames = {
        settleGroupNameResults: response.data,
      };
      return groupNames;
    });
  return response;
}

async function personForSettle(typedPersonName) {
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));

  const response = await axiosInstance
    .post("/dashboard/getPerson", typedPersonName, {
      headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
    })
    .then((response) => {
      let personNames = {
        settlePersonResults: response.data,
      };
      return personNames;
    });
  return response;
}

async function settle(data) {
    // console.log("in settle service")
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));

  const response = await axiosInstance
    .post("/dashboard/settle", data, {
      headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
    })
    .then((response) => {
      let settle = {
        insertMessage: response.data.msg,
      };
      return settle;
    });
  return response;
}
