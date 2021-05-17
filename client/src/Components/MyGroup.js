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
import axiosInstance from "../helpers/axios";
import { connect } from "react-redux";
import { MyGroupsAction } from "../redux/mygroups/MyGroupsAction";

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
      gottoGroupName: "",
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.myGroupsProps !== this.props.myGroupsProps) {
      if (this.props.myGroupsProps.joinedGroups) {
        this.setState({
          groupNames: this.props.myGroupsProps.joinedGroups.groupNames,
        });
      }
      if (this.props.myGroupsProps.invitedGroups) {
        this.setState({
          invitedGroups: this.props.myGroupsProps.invitedGroups.invitedGroups,
        });
      }
      if (this.props.myGroupsProps.joinedGroupNamesObj) {
        this.setState({
          joinedGroupNames: this.props.myGroupsProps.joinedGroupNamesObj
            .joinedGroupNames,
        });
      }
      if (this.props.myGroupsProps.names) {
        this.joinedGroup();
        this.getInvitedGroups();
        this.setState({
          joinedGroupNames: [],
        });
      }
      if (this.props.myGroupsProps.leaveGroupFlag) {
        this.setState(
          {
            successMessage: "Group left!!",
            leaveGroupFlag: true,
          },
          () => {
            this.joinedGroup();
          }
        );
      }
      if (this.props.myGroupsProps.errorFlag) {
        this.setState(
          {
            errorMessage: "Please settle your pending balance in the group",
            errorFlag: true,
          },
          () => {
            this.getInvitedGroups();
            this.joinedGroup();
          }
        );
      }
    }
  }

  componentDidMount() {
    this.getInvitedGroups();
    this.joinedGroup();
  }
  joinedGroup = () => {
    this.props.getJoinedGroups();
  };
  getInvitedGroups = () => {
    this.props.getInvitedGroups();
  };
  getGroups = () => {
    let typedGroupName = { g_name: this.state.typedSearchGroupName };
    this.props.getGroups(typedGroupName);
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
    this.props.joinGroup(idvalue);
    this.joinedGroup();
  };
  setRedirect = (e, value, name) => {
    e.preventDefault();
    this.setState({
      redirect: true,
      gotoGroupId: value,
      gottoGroupName: name,
    });
  };
  leaveGroup = async (e, value) => {
    e.preventDefault();
    let data = {
      g_id: value,
    };
    this.props.leaveGroup(data);
  };
  renderRedirect = () => {
    if (this.state.redirect) {
      return (
        <Redirect
          to={{
            pathname: "/group",
            state: {
              g_id: this.state.gotoGroupId,
              name: this.state.gottoGroupName,
            },
          }}
        ></Redirect>
      );
    }
  };

  render() {
    if (!JSON.parse(localStorage.getItem("user"))) {
      return (
        <Redirect
          to={{
            pathname: "/login",
          }}
        ></Redirect>
      );
    }
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
            {this.state.invitedGroups.length > 0 &&
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
                        style={{ marginBottom: "10px" }}
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

            {this.state.groupNames.length > 0 &&
              this.state.groupNames.map((group, index) => (
                <div key={index}>
                  <Row>
                    <Col xs="7">{group.name}</Col>

                    <Col xs="5">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={(e) => {
                          this.setRedirect(e, group.g_id, group.name);
                        }}
                        style={{ marginBottom: "10px" }}
                      >
                        Goto Group
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) => {
                          this.leaveGroup(e, group.g_id);
                        }}
                        style={{ marginBottom: "10px" }}
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

const mapStateToProps = (state, props) => {
  return {
    myGroupsProps: state.myGroupsState,
  };
};

const actionCreators = {
  getJoinedGroups: MyGroupsAction.joinedGroups,
  getInvitedGroups: MyGroupsAction.invitedGroups,
  getGroups: MyGroupsAction.getGroups,
  joinGroup: MyGroupsAction.joinGroup,
  leaveGroup: MyGroupsAction.leaveGroup,
};
export default connect(mapStateToProps, actionCreators)(MyGroup);
