import axios from "axios";
import axiosInstance from "../helpers/axios";
import jwt_decode from "jwt-decode";

export const userService = {
  login,
  register,
};

async function login(email, password) {
  const data = {
    email: email,
    password: password,
  };
  axiosInstance.defaults.withCredentials = true;
  //make a post request with the user data
  const response = await axiosInstance
    .post("/user/login", data)
    .then((response) => {
      var token = response.data;
      localStorage.setItem("token", JSON.stringify(token));
      var decoded = jwt_decode(token.split(" ")[1]);
      var user = {
        u_id: decoded.id,
        username: decoded.username,
        email: decoded.email,
      };
      localStorage.setItem("user", JSON.stringify(user));
      console.log(user);
      return user;
    });
  // console.log(response)
  return response;
}

async function register({ name, email, password }) {
  const data = {
    name: name,
    email: email,
    password: password,
  };

  axiosInstance.defaults.withCredentials = true;
  //make a post request with the user data
  const response = axiosInstance.post("/user/signup", data).then((response) => {
    // console.log(response)
    // const user = {
    //   username: name,
    //   email: email,
    //   u_id: response.data.id,
    // };
    var token = response.data;
    localStorage.setItem("token", JSON.stringify(token));
    var decoded = jwt_decode(token.split(" ")[1]);
    var user = {
      u_id: parseInt(decoded.id),
      username: decoded.username,
      email: decoded.email,
    };
    localStorage.setItem("user", JSON.stringify(user));
    return response;
  });
  return response;
}
