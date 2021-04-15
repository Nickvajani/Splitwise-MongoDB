import axiosInstance from "../helpers/axios";

export const myProfileService = {
  getProfile,
  setProfile,
};

async function getProfile(data) {
  axiosInstance.defaults.withCredentials = true;
  const response = await axiosInstance
    .post("/profile/get", data)
    .then((response) => {
      var user = {
        id: response.data[0]._id,
        email: response.data[0].email,
        username: response.data[0].name,
        defaultCurrency: response.data[0].defaultCurrency,
        phoneNumber: response.data[0].phoneNumber,
        timezone: response.data[0].timeZone,
        language: response.data[0].language,
        imageName: response.data[0].profilePicture,
      };
      return user;
    });
  //   console.log(response)
  return response;
}

async function setProfile(data) {
  axiosInstance.defaults.withCredentials = true;
  const response = axiosInstance
    .put("/profile/update", data, {
      headers: { user: JSON.parse(localStorage.getItem("user"))?._id },
    })
    .then((response) => {
      // this.setState({redirectF: true });

      console.log(response);
      return response;
    });
  return response;
}
