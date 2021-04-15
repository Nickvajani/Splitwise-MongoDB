import React from "react";
import "./Navbar.css";
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
} from "react-router-dom";
import Login from "./Login";
import { Component } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { NavbarBrand } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import splitwise from "../splitwise.png";

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
      dashboard: false,
      myGroup: false,
      profile: false,
      createGroup: false,
      recentActivity: false,
    };
  }
  logout() {
    //let redirectvar = null;
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    this.setState({
      redirect: true,
    });
  }
  dashboard() {
    this.setState({
      dashboard: true,
    });
  }
  myGroup() {
    this.setState({
      myGroup: true,
    });
  }
  myProfile() {
    this.setState({
      profile: true,
    });
  }
  createGroup() {
    this.setState({
      createGroup: true,
    });
  }
  recentActivity() {
    this.setState({
      recentActivity: true,
    });
  }

  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to="/login"></Redirect>;
    }
    if (this.state.dashboard) {
      this.setState({
        dashboard: false,
      });
      return <Redirect to="/dashboard"></Redirect>;
    }
    if (this.state.myGroup) {
      this.setState({
        myGroup: false,
      });
      return <Redirect to="/mygroups"></Redirect>;
    }
    if (this.state.profile) {
      this.setState({
        profile: false,
      });
      return <Redirect to="/profile"></Redirect>;
    }
    if (this.state.createGroup) {
      this.setState({
        createGroup: false,
      });
      return <Redirect to="/createGroup"></Redirect>;
    }
    if (this.state.recentActivity) {
      this.setState({
        recentActivity: false,
      });
      return <Redirect to="/recentactivity"></Redirect>;
    }

    let currentUser = JSON.parse(localStorage.getItem("user"))?.username;

    if (currentUser == null) {
      return (
        <nav className="navbar navbar-custom">
          <div class="col">
            <img src={splitwise} style={{ height: "19px" }}></img>Splitwise
          </div>
          <div class="col text-right">
            <Link to="/login">
              <button type="button" class="btn btn-primary btn-sm">
                Login
              </button>
            </Link>
          </div>
          <label>or</label>

          <div class="col text-left">
            <Link to="/signup">
              <button type="button" class="btn btn-primary btn-sm">
                Sign up
              </button>
            </Link>
          </div>
        </nav>
      );
    } else {
      return (
        <nav className="navbar navbar-custom">
          <div class="col">
            <img src={splitwise} style={{ height: "19px" }}></img>Splitwise
          </div>

          <div class="col text-right">
            <DropdownButton id="dropdown-default-button" title={currentUser}>
              <Dropdown.Item onClick={this.dashboard.bind(this)}>
                Dashboard
              </Dropdown.Item>
              <Dropdown.Item onClick={this.myGroup.bind(this)}>My group</Dropdown.Item>
              <Dropdown.Item onClick={this.myProfile.bind(this)}>My Profile</Dropdown.Item>
              <Dropdown.Item onClick={this.createGroup.bind(this)}>Create Group</Dropdown.Item>
              <Dropdown.Item onClick={this.recentActivity.bind(this)}>Recent Activity</Dropdown.Item>
              <Dropdown.Item href="./login" onClick={this.logout.bind(this)}>
                Logout
              </Dropdown.Item>
            </DropdownButton>
          </div>
        </nav>
      );
    }
  }
}

export default withRouter(Navbar);
