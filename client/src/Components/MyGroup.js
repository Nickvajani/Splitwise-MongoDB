import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import axios from "axios";
import GroupSuggestions from "./GroupSuggestions";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Group from "./Group";
import { Redirect } from "react-router";
import { Alert } from "react-bootstrap";
import axiosInstance from "../helpers/axios"

class MyGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      gotoGroupId: 0,
      redirect: false,
      groupNames: [],
      joinedGroupNames: [],
      typedSearchGroupName: "",
      invitedGroups: [],
      errorMessage: "",
      errorFlag: false,
      leaveGroupFlag: false,
      joinGroupFlag: false,
      successMessage: "",
    };
  }
  componentDidMount() {
    this.getInvitedGroups();
    this.joinedGroup();
  }
  joinedGroup = () => {
    axiosInstance.defaults.withCredentials = true;
    const response = axiosInstance
      .get(
        "/mygroups/joined",
        {
          headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
        }
      )
      .then((response) => {
        this.setState({
          groupNames: response.data,
        });
      });
  };
  getInvitedGroups = () => {
    axiosInstance.defaults.withCredentials = true;
    const response = axiosInstance
      .get(
        "/mygroups/invites",
        {
          headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
        }
      )
      .then((response) => {
        this.setState({
          invitedGroups: response.data,
        });
      });
  };
  getGroups = () => {
    axiosInstance.defaults.withCredentials = true;
    let typedGroupName = { g_name: this.state.typedSearchGroupName };
    const response = axiosInstance
      .post(
        "/mygroups/getGroups",
        typedGroupName,
        {
          headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
        }
      )
      .then((response) => {
        this.setState({
          joinedGroupNames: response.data,
        });
      });
  };
  handleInputGroupNameChange = () => {
    this.setState(
      {
        typedSearchGroupName: this.search.value,
      },
      () => {
        if (this.state.typedSearchGroupName == "")
          this.setState({ joinedGroupNames: [] });
        if (
          this.state.typedSearchGroupName &&
          this.state.typedSearchGroupName.length >= 1
        ) {
          this.getGroups();
        }
      }
    );
  };

  joinGroup = (event, idvalue, namevalue) => {
    event.preventDefault();

    let recentlyJoinedGroup = {
      g_id: idvalue,
      name: namevalue,
    };
    let updatedGroups = this.state.invitedGroups.filter(
      (user) => user.g_id != idvalue
    );
    this.setState({
      invitedGroups: updatedGroups,
      joinGroupFlag: true,
      successMessage: "Group Joined Successfully!!",
    });
    axiosInstance.defaults.withCredentials = true;
    const response = axiosInstance
      .put(
        "/mygroups/" +
          idvalue +
          "/accept",
        null,
        {
          headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
        }
      )
      .then((response) => {
        this.joinedGroup();
        this.getInvitedGroups();
        this.setState({
          joinedGroupNames: [],
        });
      });
    this.joinedGroup();
  };
  setRedirect = (e, value) => {
    e.preventDefault();
    this.setState({
      redirect: true,
      gotoGroupId: value,
    });
  };
  leaveGroup = async (e, value) => {
    e.preventDefault();
    let data = {
      g_id: value,
    };
    axiosInstance.defaults.withCredentials = true;
    const response = await axiosInstance
      .delete(
        "/mygroups/leave/" +
          data.g_id,
        {
          headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
        }
      )
      .then((response) => {
        console.log(response.status);
        console.log(response);
        if (response.status == 204) {
          console.log("inside");
          this.setState({
            errorMessage: "Please settle your pending balance in the group",
            errorFlag: true,
          });
        } else if (response.status === 200) {
          console.log("else if");
          this.setState({
            successMessage: "Group left!!",
            leaveGroupFlag: true,
          });
        }
      });
    this.getInvitedGroups();
    this.joinedGroup();
  };
  renderRedirect = () => {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/group",
            state: { g_id: this.state.gotoGroupId },
          }}
        ></Redirect>
      );
    }
  };

  render() {
    const renderError = () => {
      if (this.state.errorFlag) {
        return <Alert variant="danger">{this.state.errorMessage}</Alert>;
      }
      setTimeout(() => {
        this.setState({
          errorFlag: false,
        });
      }, 8000);
    };
    const renderSuccess = () => {
      if (this.state.leaveGroupFlag || this.state.joinGroupFlag) {
        return <Alert variant="success">{this.state.successMessage}</Alert>;
      }
      setTimeout(() => {
        this.setState({
          leaveGroupFlag: false,
          joinGroupFlag: false,
        });
      }, 9000);
    };

    return (
      <div>
        {this.renderRedirect()}
        <Row>
          <Col></Col>
          <Col>
            <form style={{ textAlign: "left" }}>
              <input
                placeholder="Enter Group name..."
                ref={(input) => (this.search = input)}
                onChange={this.handleInputGroupNameChange}
              />
              <GroupSuggestions
                joinedGroupNames={this.state.joinedGroupNames}
              />
            </form>
          </Col>
          <Col></Col>
        </Row>

        <Row>
          <Col>
            <h6>Groups in which you are invited</h6>
            {this.state.invitedGroups.length>0 &&
            this.state.invitedGroups.map((group, index) => (
              <div key={index}>
                <Row>
                  <Col xs="7">{group.name}</Col>

                  <Col xs="2">
                    <Button
                      onClick={(e) => {
                        this.joinGroup(e, group.g_id);
                      }}
                      size="sm"
                    >
                      Join
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
          </Col>
          <Col></Col>
          <Col>
            <h6>Groups in which you are member:</h6>
            {renderError()}
            {renderSuccess()}

            {this.state.groupNames.length>0 &&
            this.state.groupNames.map((group, index) => (
              <div key={index}>
                <Row>
                  <Col xs="7">{group.name}</Col>

                  <Col xs="5">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        this.setRedirect(e, group.g_id);
                      }}
                    >
                      Goto Group
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={(e) => {
                        this.leaveGroup(e, group.g_id);
                      }}
                    >
                      Leave Group
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
          </Col>
        </Row>
      </div>
    );
  }
}

export default MyGroup;
