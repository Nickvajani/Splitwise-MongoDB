import React, { Component } from "react";
import { Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import { loginAction } from '../redux/login/loginAction';
import { connect } from 'react-redux';
import { Redirect } from "react-router";
import splitwise from "../splitwise.png"


class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errorMessage: "",
      refreshp: true,
      token: "",
    };
    this.useremailHandler = this.useremailHandler.bind(this);
    this.userpasswordHandler = this.userpasswordHandler.bind(this);
    this.submitLogin = this.submitLogin.bind(this);
  }

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
  submitLogin = (e) => {
    e.preventDefault();
    this.props.login(this.state.email, this.state.password);
    
  };
 
  render() {
    if(JSON.parse(localStorage.getItem("user"))){
      return <Redirect to={{
        pathname: '/dashboard',
    }}></Redirect>
    }

    const renderError = () => {
      if (this.props.loginProps.errorFlag) {
        console.log("Render error")

        return <Alert variant="danger">Login failed</Alert>;
      }
      setTimeout(() => {
        this.setState({
          errorFlag: false
        })
      }, 3000);
    };
    return (
      <div>
        <div className="container-fluid">
          <div className="row">
            <form className="form-container center_div ">
              <div className="">
                <h1>Welcome to Splitwise</h1>
                <div className="row">
                  <div className="col-sm">
                  <label>Email address</label>
                  <input
                    type="email"
                    onChange={this.useremailHandler}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Enter email"
                    name="email"
                    required
                  />
                  <label>Password</label>
                  <input
                    type="password"
                    onChange={this.userpasswordHandler}
                    className="form-control"
                    id="exampleInputPassword1"
                    placeholder="Enter password"
                    name="psw"
                    required
                  />
              {renderError()}
                  </div>
                  <div className="col-sm"> 
                  <img src={splitwise} style={{height:"150px"}}></img>
                  </div>
                </div>
                <div className="row">
                </div>
              </div>
              <div className="form">
                <div className="row">
                </div>
                <div className="row">
                </div>
              </div>
              <div className="submitbutton">
                <button
                  type="submit"
                  className="btn btn-success btn-lg btn-block "
                  onClick={this.submitLogin}
                >
                  Submit
                </button>
                <a className="newlink" href="./signup">
                  New user?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

// function mapState(state) {
//   const { loggingIn, errorFlag } = state;
//   return { loggingIn, errorFlag };
// }
const mapStateToProps = (state, props) => {

  return {
      loginProps: state.loginState
    }
}

const actionCreators = {
  login: loginAction.login,

  // logout: loginAction.logout
};

export default connect(mapStateToProps, actionCreators)(Login);