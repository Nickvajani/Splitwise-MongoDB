import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Suggestions from "./Suggestions";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { Alert } from "react-bootstrap";
import { Redirect } from "react-router";
import axiosInstance from "../helpers/axios"


class CreateGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUserName: "",
      currentUserEmail: "",
      groupname: "",
      query: "",
      results: [],
      finalId: "",
      finalName: "",
      finalEmail: "",
      query2: "",
      results2: [],
      isEmail: false,
      isName: false,
      userDetails: [],
      addToGroupFlag: true,
      groupCreateFlag: false,
      groupCreatedMessage:'',
      redirectF: false,
      createGroupFlag: true

    };
  }
  componentDidMount() {
    this.setState({
      currentUserName: JSON.parse(localStorage.getItem("user"))?.username,
      currentUserEmail: JSON.parse(localStorage.getItem("user"))?.email,
    });
  }
  getInfo2 = () => {
    axiosInstance.defaults.withCredentials = true;
    let typedEmail = { email: this.state.query2 };
    const response = axiosInstance
      .post("/creategroup/getEmail", typedEmail)
      .then((response) => {
        this.setState({
          results2: response.data,
        });
      });
  };
  getInfo = () => {
    axiosInstance.defaults.withCredentials = true;
    let typedName = { name: this.state.query };
    const response = axiosInstance
      .post("/creategroup/getName", typedName)
      .then((response) => {
        this.setState({
          results: response.data,
        });
      });
  };
  onTodoGroupNameChange(value) {
    this.setState({
      groupname: value,
    },() => {
      if(this.state.groupname.length<1){
        this.setState({
          createGroupFlag: true
        })
      }
      if(this.state.groupname.length>0 && this.state.userDetails.length>0){
        this.setState({
          createGroupFlag: false
        })
      }
    });
  }
  addToGroup = (e) => {
    e.preventDefault();
    console.log(this.state.finalName, this.state.finalId);
    if (this.state.finalId && this.state.finalName) {
      this.state.userDetails.push({
        id: this.state.finalId,
        name: this.state.finalName,
        email: this.state.finalEmail,
      });
      this.setState({ userDetailsFlag: true, addToGroupFlag: true,results2:[],results:[],createGroupFlag: false });
    }
  };
  removeMember = (event, value) => {
    event.preventDefault();
    let updatedUserDetails = this.state.userDetails.filter(
      (user) => user.id != value
    );
    this.setState({
      userDetails: updatedUserDetails,
    });
    if(this.state.userDetails.length==0){
      console.log('hi')
      this.setState({
        createGroupFlag:true
      })
    }
  };
  creategroup = (e) => {
    e.preventDefault();
    let userid = [];
    for (let i = 0; i < this.state.userDetails.length; i++) {
      userid.push(this.state.userDetails[i].id);
    }
    let currentUser =  JSON.parse(localStorage.getItem("user"))?.u_id
    userid.push(currentUser)

    let groupData = {
      g_name: this.state.groupname,
      users: userid,
    };

    axiosInstance.defaults.withCredentials = true;
    const response = axiosInstance
      .post("/creategroup", groupData, {
        headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
      })
      .then((response) => {
        this.setState({
          groupCreatedMessage: response.data.msg,
          groupCreateFlag: true,
           redirectF: true
        })
      })
      .catch((err) => {
        if (err.response.status === 400) {
          this.setState({
            errorMessage: "Group Already exists with the same name",
            errorFlag: true,
            
          });
        }
      });
  };
  handleInputEmailChange = () => {
    this.setState(
      {
        query2: this.search2.value,
      },
      () => {
        if (this.state.query2 == "") this.setState({ results2: [] });
        if (this.state.query2 && this.state.query2.length > 1) {
          this.getInfo2();
        }
        //store only when the suggested list length is 1
        if (this.state.results2.length == 1) {
          //check whether the last suggested name and entered name are same then set state for final values
          if (this.state.query2 == this.state.results2[0].email) {
            //if userDetails has no data then directly add from else part
            if (this.state.userDetails.length != 0) {
              for (let i = 0; i < this.state.userDetails.length; i++) {
                //if the typed name is not added in the userDetails, only then add the value to userDetails and change the flag
                if (
                  this.state.query2 != this.state.userDetails[i].name &&
                  this.state.query2 != this.state.currentUserEmail
                ) {
                  this.setState({
                    finalId: this.state.results2[0].id,
                    finalName: this.state.results2[0].name,
                    finalEmail: this.state.results2[0].email,
                    addToGroupFlag: false,
                  });
                  this.setState({ results2: [] });
                }
              }
            }
            //if the userDetails is empty then directly add
            else {
              if (this.state.query2 != this.state.currentUserEmail) {
                this.setState({
                  finalId: this.state.results2[0].id,
                  finalName: this.state.results2[0].name,
                  finalEmail: this.state.results2[0].email,
                  addToGroupFlag: false,
                });
                this.setState({ results2: [] });
              }
            }
          }
        }
        //to enable both input in the starting
        if (this.state.query2.length == 0) {
          this.setState({
            isName: false,
          });
        } else {
          //to disable othe input if the length of current input is > 0
          this.setState({
            isName: true,
          });
        }
      }
    );
  };
  handleInputNameChange = () => {
    this.setState(
      {
        query: this.search.value,
      },
      () => {
        if (this.state.query.length == "") this.setState({ results: [] });
        if (this.state.query && this.state.query.length >= 1) {
          this.getInfo();
        }
        //store only when the suggested list length is 1
        if (this.state.results.length == 1) {
          //check whether the last suggested name and entered name are same then set state for final values
          if (this.state.query == this.state.results[0].name) {
            //if userDetails has no data then directly add from else part
            if (this.state.userDetails.length != 0) {
              for (let i = 0; i < this.state.userDetails.length; i++) {
                //if the typed name is not added in the userDetails, only then add the value to userDetails and change the flag
                if (
                  this.state.query != this.state.userDetails[i].name &&
                  this.state.query != this.state.currentUserName
                ) {
                  this.setState({
                    finalId: this.state.results[0].id,
                    finalName: this.state.results[0].name,
                    addToGroupFlag: false,
                  });
                  this.setState({ results: [] });
                }
              }
            }
            //if the userDetails is empty then directly add
            else {
              if(this.state.query != this.state.currentUserName){
                
                this.setState({
                  finalId: this.state.results[0].id,
                  finalName: this.state.results[0].name,
                  addToGroupFlag: false,
                });
                this.setState({ results: [] });
              }
            }
          }
        }
        //to enable both input in the starting
        if (this.state.query.length == 0) {
          this.setState({
            isEmail: false,
            addToGroupFlag: true,
          });
        } else {
          //to disable othe input if the length of current input is > 0
          this.setState({
            isEmail: true,
          });
        }
      }
    );
  };

  render() {
    if(!JSON.parse(localStorage.getItem("user"))){
      return <Redirect to={{
        pathname: '/login',
    }}></Redirect>
    }
    const renderSuccess = () => {
      if (this.state.groupCreateFlag) {
        return <Alert variant="success">{this.state.groupCreatedMessage}</Alert>;
      }
      setTimeout(() => {
        this.setState({
          groupCreateFlag: false,
        });
      }, 12000);
    };
    const renderError = () => {
      if (this.state.errorFlag) {
        return <Alert variant="danger">{this.state.errorMessage}</Alert>;
      }
      setTimeout(() => {
        this.setState({
          errorFlag: false,
        });
      }, 12000);
    };  

    const redirectCheck = () => {
      if (this.state.redirectF) {
        return <Redirect to={{ pathname: "/dashboard" }}></Redirect>;
      }
    };

    return (
      <div>
         {redirectCheck()}
        <Container>
          <Row>

            <Col>
              <Image src="holder.js/171x180" rounded />
              <Form>
                <Form.Group>
                  <Form.File
                    id="exampleFormControlFile1"
                    label="Example file input"
                  />
                </Form.Group>
              </Form>
            </Col>
            <Col>
            {renderSuccess()}
            {renderError()}
              <label for="name-input" style={{ fontSize: "13px" }}>
                START A NEW GROUP:
              </label>
              <br />
              <label for="name-input" style={{ fontSize: "16px" }}>
                MY GROUP SHALL BE CALLED:
              </label>
              <br></br>

              <input
                type="text"
                id={"todoName" + this.props.id}
                onChange={(e) => this.onTodoGroupNameChange(e.target.value)}
              ></input>
              <hr></hr>
            </Col>
            <form style={{ textAlign: "left" }}>
              <Col>
                <label for="name-input" style={{ fontSize: "13px" }}>
                  GROUP MEMBERS:
                </label>
                <br></br>
                <input
                  disabled={this.state.isName}
                  onClick={this.onClickNameChange}
                  placeholder="Enter name..."
                  ref={(input) => (this.search = input)}
                  onChange={this.handleInputNameChange}
                />
                <Suggestions results={this.state.results} isEmail={false} />

                <input
                  disabled={this.state.isEmail}
                  onClick={this.onClickEmailChange}
                  placeholder="Enter email..."
                  ref={(input) => (this.search2 = input)}
                  onChange={this.handleInputEmailChange}
                />
                <Suggestions results={this.state.results2} isEmail={true} />
              </Col>
            </form>
          </Row>
          <div style={{ textAlign: "left" }}>
            <Row>
              <Col xs="1">Name</Col>
              <Col xs="2">User ID:</Col>
              <Col>
                <Button
                  disabled={this.state.addToGroupFlag}
                  onClick={this.addToGroup}
                >
                  Add to group
                </Button>
              </Col>
              <Col>
                <Button disabled={this.state.createGroupFlag} onClick={this.creategroup}>Create group</Button>
              </Col>
            </Row>
            {this.state.userDetailsFlag &&
              this.state.userDetails.map((user, index) => (
                <div key={index}>
                  <Row>
                    <Col xs="1">{user.name}</Col>
                    <Col xs="2">
                      <Button
                        onClick={(e) => {
                          this.removeMember(e, user.id);
                        }}
                        size="sm"
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}
          </div>

          <Row></Row>
        </Container>
      </div>
    );
  }
}

export default CreateGroup;
