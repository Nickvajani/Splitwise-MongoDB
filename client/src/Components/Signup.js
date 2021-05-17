import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Signup.css";
import axios from "axios";
import { signupAction } from "../redux/signup/signupAction";
import { connect } from "react-redux";
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
} from "react-router-dom";
import { Alert } from "react-bootstrap";

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
    };
    this.usernameHandler = this.usernameHandler.bind(this);
    this.useremailHandler = this.useremailHandler.bind(this);
    this.userpasswordHandler = this.userpasswordHandler.bind(this);
    this.adduser = this.adduser.bind(this);
  }
  usernameHandler = (e) => {
    this.setState({
      name: e.target.value,
    });
  };
  useremailHandler = (e) => {
    this.setState({
      email: e.target.value,
    });
  };
  userpasswordHandler = (e) => {
    this.setState({
      password: e.target.value,
    });
  };

  adduser = (e) => {
    e.preventDefault();
    const userData = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
    };
    this.props.register(userData);

    // const data = {
    //   name: this.state.name,
    //   email: this.state.email,
    //   password: this.state.password,
    // };
    // axios.defaults.withCredentials = true;
    // //make a post request with the user data
    // axios.post('http://localhost:3001/signup',data)
    //     .then(response => {
    //         console.log("Status Code : ",response.status);
    //         alert("Record Created")
    //         //this.props.history.push("/")
    //        }).catch(err => {
    //         alert(err.response.data.msg)
    //         //this.props.history.push("/create")

    //     });
  };
  render() {
    const renderError = () => {
      if (this.props.signupProps.errorFlag) {
        console.log("Render error");

        return <Alert variant="danger">Email Already Exists</Alert>;
      }
      setTimeout(() => {
        this.setState({
          errorFlag: false,
        });
      }, 3000);
    };

    if (JSON.parse(localStorage.getItem("user"))) {
      return (
        <Redirect
          to={{
            pathname: "/dashboard",
          }}
        ></Redirect>
      );
    }
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <form
              onSubmit={this.adduser}
              target="_blank"
              className="form-container center_div "
            >
              <div className="form">
                <div>
                  <h5>INTRODUCE YOURSELF</h5>
                  <hr></hr>

                  <div className="row">
                    <div className="col">
                      <div className="row">
                        <label>Hi there! My name is</label>
                        <input
                          type="text"
                          onChange={this.usernameHandler}
                          className="form-control"
                          placeholder="First name"
                          name="uname"
                          required
                        />
                      </div>
                      <br />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="row">
                        <label for="email">Here’s my email address:</label>
                        <input
                          type="email"
                          onChange={this.useremailHandler}
                          className="form-control"
                          placeholder="Enter Email"
                          name="email"
                          required
                        />
                      </div>
                      <br />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="row">
                        <label for="psw">And here’s my password:</label>
                        <input
                          type="password"
                          onChange={this.userpasswordHandler}
                          className="form-control"
                          placeholder="Enter Password"
                          name="psw"
                          required
                        />
                      </div>
                      <br />
                    </div>
                  </div>
                  <div className="clearfix">
                    <div className="row">
                      <br></br>
                      {renderError()}
                      <button
                        type="submit"
                        className="signupbtn btn btn-success btn-lg btn-block"
                      >
                        Sign Up
                      </button>
                    </div>
                    <div className="row">
                      <p>
                        By creating an account you agree the Splitwise Terms &
                        Privacy
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

// function mapState(state) {
//   const { registering } = state;
//   return { registering };
// }

const mapStateToProps = (state, props) => {
  return {
    signupProps: state.registerState,
  };
};

const actionCreators = {
  register: signupAction.register,
};

export default connect(mapStateToProps, actionCreators)(Signup);
