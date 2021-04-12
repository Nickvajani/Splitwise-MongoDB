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
import splitwise from "../splitwise.png"

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
    };
  }
  logout() {
    //let redirectvar = null;
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    this.setState({
      redirect: true,
    });
    //redirectvar = <Redirect to="/login"></Redirect>;
    // this.props.history.push('/')
  }
  
  render() {
    // const { redirect } = this.state;
    // if (redirect) {
    //   return <Redirect to="/login"></Redirect>;
    // }

    let currentUser = JSON.parse(localStorage.getItem("user"))?.username

    if (currentUser == null) {
      return (
        <nav className="navbar navbar-custom">
          
          <div class="col"><img src={splitwise} style={{height:"19px"}}></img>Splitwise</div>
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
          <div class="col"><img src={splitwise} style={{height:"19px"}}></img>Splitwise</div>

          <div class="col text-right">
            <DropdownButton
              id="dropdown-default-button"
              title={currentUser}
            >
              <Dropdown.Item href="./dashboard">Dashboard</Dropdown.Item>
              <Dropdown.Item href="./mygroups">My group</Dropdown.Item>
              <Dropdown.Item href="./profile">My Profile</Dropdown.Item>
              <Dropdown.Item href="./createGroup">Create Group</Dropdown.Item>
              <Dropdown.Item href="./recentactivity">
                Recent Activity
              </Dropdown.Item>
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
