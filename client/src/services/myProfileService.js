import axiosInstance from "../helpers/axios";

export const myProfileService = {
  getProfile,
  setProfile,
};

async function getProfile(data) {
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.headers.common["authorization"] = JSON.parse(
    localStorage.getItem("token")
  );

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
  // console.log("entering service");
  // console.log(data);

  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.headers.common["authorization"] = JSON.parse(
    localStorage.getItem("token")
  );

  const response = axiosInstance
    .put("/profile/update", data, {
      headers: { user: JSON.parse(localStorage.getItem("user"))?._id },
    })
    .then((response) => {
      // this.setState({redirectF: true });
      console.log(data);
      console.log("service");
      let localdata = {
        u_id: data.id,
        username: data.username,
        email: data.email,
      };
      console.log(localdata);
      localStorage.setItem("user", JSON.stringify(localdata));
      return response;
    });
  return response;
}
