import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./ProfilePage.css";
import Button from "react-bootstrap/Button";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import axios from "axios";
import { Redirect } from "react-router";
import FileUpload from "./FileUpload";
import axiosInstance from "../helpers/axios";
import { connect } from "react-redux";
import { ProfilePageAction } from "../redux/profilepage/ProfilePageAction";

class ProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: 0,
      password: "",
      username: "",
      email: "",
      phoneNumber: "",
      defaultCurrency: "",
      timezone: "",
      language: "",
      useremail: "",
      redirectF: false,
      imageName: "",

    };
  }

  componentDidUpdate(prevProps) {
    console.log(this.props.profileProps)
    if (prevProps.profileProps !== this.props.profileProps) {
      this.setState(
        {
          id: this.props.profileProps.user.id || "",
          email: this.props.profileProps.user.email || "",
          username: this.props.profileProps.user.username || "",
          defaultCurrency: this.props.profileProps.user.defaultCurrency || "",
          phoneNumber: this.props.profileProps.user.phoneNumber || "",
          timezone: this.props.profileProps.user.timezone || "",
          language: this.props.profileProps.user.language || "",
          imageName: this.props.profileProps.user.imageName || ""
        },
        () => {
          console.log("from main page " + this.state.imageName);
        }
      );
    }
  }

  getUserData = () => {
    const data = { email: this.state.useremail };
    this.props.getProfile(data);

    // axiosInstance.defaults.withCredentials = true;
    // //make a post request with the user data
    // const data = { email: this.state.useremail };
    // const response = axiosInstance
    //   .post(
    //     "/profile/get",
    //     data
    //   )
    //   .then((response) => {
    //     this.setState(
    //       {
    //         id: response.data[0]._id,
    //         email: this.state.useremail,
    //         // password: response.date[0].password,
    //         username: response.data[0].name,
    //         defaultCurrency: response.data[0].defaultCurrency,
    //         phoneNumber: response.data[0].phoneNumber,
    //         timezone: response.data[0].timeZone,
    //         language: response.data[0].language,
    //       },
    //       () => {
    //         console.log(this.state.id);
    //       }
    //     );
    //   });
  };

  async componentDidMount() {
    this.setState(
      {
        useremail: JSON.parse(localStorage.getItem("user"))?.email,
      },
      () => {
        this.getUserData();
      }
    );
  }
  onTodoNameChange(value) {
    this.setState({
      username: value,
    });
  }
  onTodoEmailChange(value) {
    this.setState({
      email: value,
    });
  }
  onTodoPhoneChange = (e) => {
    const re = /^[0-9\b]+$/;
    // const re=  /\d*/
    // if value is not blank, then test the regex
    if (e.target.value === "" || re.test(e.target.value)) {
      this.setState({
        phoneNumber: e.target.value,
      });
    }
  };
  onTodoCurrencyChange(value) {
    this.setState({
      defaultCurrency: value,
    });
  }
  onTodoTimezoneChange(value) {
    this.setState({
      timezone: value,
    });
  }
  onTodoLanguageChange(value) {
    this.setState({
      language: value,
    });
  }
  saveInfo = (e) => {
    console.log("saving");
    e.preventDefault();
    const data = {
      id: this.state.id,
      username: this.state.username,
      email: this.state.email,
      phoneNumber: this.state.phoneNumber,
      defaultCurrency: this.state.defaultCurrency,
      timezone: this.state.timezone,
      language: this.state.language,
    };
    const localdata = {
      email: this.state.email,
      username: this.state.username,
      u_id: this.state.id,
    };
    console.log(localdata);
    console.log(data);

    this.props.setProfile(data)

    // const response = axiosInstance
    //   .put(
    //     "/profile/update",
    //     data,
    //     {
    //       headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
    //     }
    //   )
    //   .then((response) => {
    //     this.setState({ redirectF: true });

    //     console.log(response);
    //     localStorage.setItem("user", JSON.stringify(localdata));
    //   });
  };

  render() {
    const redirectCheck = () => {
      if (this.props.profileProps.redirectF) {
        return <Redirect to={{ pathname: "/dashboard" }}></Redirect>;
      }
    };
    // let sess = JSON.parse(localStorage.getItem("user"))?.email;
    // if (sess == null) {
    //   return <Redirect to="/login"></Redirect>;
    // }

    return (
      <div>
        {redirectCheck()}
        <Container>
          <Row>
            <Col xs={6} md={4}>
              <FileUpload imageName={this.state.imageName}></FileUpload>
            </Col>

            <Col xs="5">
              <form>
                <label for="name-input">Your Name:</label>
                <br />
                <input
                  type="text"
                  id={"todoName" + this.props.id}
                  value={this.state.username}
                  onChange={(e) => this.onTodoNameChange(e.target.value)}
                ></input>{" "}
                <br />
                <label>Your email address:</label>
                <br />
                <input
                  type="email"
                  id={"todoEmail" + this.props.id}
                  value={this.state.email}
                  onChange={(e) => this.onTodoEmailChange(e.target.value)}
                ></input>{" "}
                <br />
                <label>Your phone number:</label>
                <br />
                <input
                  placeholder="Enter Your number"
                  value={this.state.phoneNumber}
                  id={"todoPhone" + this.props.id}
                  onChange={this.onTodoPhoneChange}
                  type="number"
                ></input>
                <br />
                <br />
                <br />
                <Button
                  onClick={this.saveInfo.bind(this)}
                  as="input"
                  type="button"
                  value="Save"
                />
              </form>
            </Col>
            <Col>
              <label>Your Default currency:</label>
              <Form.Control
                value={this.state.defaultCurrency}
                id={"todoCurrency" + this.props.id}
                as="select"
                custom
                onChange={(e) => this.onTodoCurrencyChange(e.target.value)}
              >
                <option value="">Select Currency</option>
                <option value="USD">USD</option>
                <option value="KWD">KWD</option>
                <option value="BHD">BHD</option>
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
                <option value="CAD">CAD</option>
              </Form.Control>
              {/* <DropdownButton
                id="dropdown-default-button"
                title="Default currency"
              >
                <Dropdown.Item href="#/action-1" value="USD">
                  USD
                </Dropdown.Item>
                <Dropdown.Item href="#/action-2">KWD</Dropdown.Item>
                <Dropdown.Item href="#/action-3">BHD</Dropdown.Item>
                <Dropdown.Item href="#/action-4">GBP</Dropdown.Item>
                <Dropdown.Item href="#/action-5">EUR</Dropdown.Item>
                <Dropdown.Item href="#/action-6">CAD</Dropdown.Item>
              </DropdownButton> */}
              <label>Your time zone:</label>
              <Form.Control
                value={this.state.timezone}
                as="select"
                id={"todoTime" + this.props.id}
                custom
                onChange={(e) => this.onTodoTimezoneChange(e.target.value)}
              >
                <option value="">Select Timezone</option>
                <option value="(GMT-08:00) Pacific Time (US &amp; Canada)">
                  (GMT-08:00) Pacific Time (US &amp; Canada)
                </option>
                <option value="(GMT-07:00) Arizona">(GMT-07:00) Arizona</option>
                <option value="(GMT-06:00) Mexico City">
                  (GMT-06:00) Mexico City
                </option>
                <option value="(GMT+00:00) London">(GMT+00:00) London</option>
                <option value="(GMT+01:00) Paris">(GMT+01:00) Paris</option>
              </Form.Control>
              {/* <DropdownButton
                id="dropdown-default-button"
                title="Default timezone"
              >
                <Dropdown.Item href="#/action-1">
                  (GMT-08:00) Pacific Time (US &amp; Canada)
                </Dropdown.Item>
                <Dropdown.Item href="#/action-2">
                  (GMT-07:00) Arizona
                </Dropdown.Item>
                <Dropdown.Item href="#/action-3">
                  (GMT-06:00) Mexico City
                </Dropdown.Item>
                <Dropdown.Item href="#/action-4">
                  (GMT+00:00) London
                </Dropdown.Item>
                <Dropdown.Item href="#/action-5">
                  (GMT+01:00) Paris
                </Dropdown.Item>
              </DropdownButton> */}
              <label>Your language:</label>
              <Form.Control
                value={this.state.language}
                as="select"
                id={"todoPhone" + this.props.id}
                custom
                onChange={(e) => this.onTodoLanguageChange(e.target.value)}
              >
                <option value="">Select Language</option>
                <option value="English">English</option>
                <option value="French">French</option>
              </Form.Control>

              {/* <DropdownButton
                id="dropdown-default-button"
                title="Default timezone"
              >
                <Dropdown.Item href="#/action-1">English</Dropdown.Item>
                <Dropdown.Item href="#/action-2">French</Dropdown.Item>
              </DropdownButton> */}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    profileProps: state.getProfileState,
  };
};

const actionCreators = {
  getProfile: ProfilePageAction.getProfile,
  setProfile: ProfilePageAction.setProfile
};
export default connect(mapStateToProps, actionCreators)(ProfilePage);
