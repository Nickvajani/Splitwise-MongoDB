import axiosInstance from "../helpers/axios";

export const recentActivityService = {
  userDetails,
  recentActivity
};

async function userDetails() {
  axiosInstance.defaults.withCredentials = true;
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

async function recentActivity(){
    axiosInstance.defaults.withCredentials = true;
    const response = await axiosInstance
      .get("/recentActivity", {
        headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
      })
      .then((response) => {
        let recentActivity = {
            recentActivityDetails: response.data,
        }
        return recentActivity
      });
      return response
}
