import React, { Component } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { Redirect } from "react-router";
import axios from "axios";
import { Form, Modal } from "react-bootstrap";
import DashboardSuggestions from "./DashboardSuggestions";
import axiosInstance from "../helpers/axios"


class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      numberOfGroups: [],
      groupDetails: [],
      groupNames: [],
      userDefaultCurrency: "",
      userTotalOwe: 0,
      userTotalGet: 0,
      userTotalAmount: 0,
      show: false,
      settleGroupName: "",
      settleGroupNameResults: [],
      settleGroupNameToBePassed: "",
      settleGroupIdToBePassed: "",
      settlePerson: "",
      settlePersonResults: [],
      settlePersonToBePassed: "",
      settlePersonIdToBePassed: "",
      insertMessage:'',
      errorFlag: false,
      errorMessage:'',
      settleFlag: true

    };
  }
  getNumberOfGroups = async () => {
    axiosInstance.defaults.withCredentials = true;
    const response4 = await axiosInstance
      .get("/dashboard/getGroupsId", {
        headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
      })
      .then((response) => {
        this.setState(
          {
            numberOfGroups: response.data,
          },
          () => {
            console.log(this.state.numberOfGroups)
          }
        );
      });

    for (let i = 0; i < this.state.numberOfGroups.length; i++) {
     let names = await this.getGroupNames(this.state.numberOfGroups[i]);
    }
    console.log(this.state.groupNames)
    let arr = [];
    for (let i = 0; i < this.state.numberOfGroups.length; i++) {
      let s = await this.getGroupDetails(this.state.numberOfGroups[i]);
      arr.push(s);
    }
    this.setState({
      groupDetails: arr,
    });
  };
  getGroupNames = async (value) => {
    axiosInstance.defaults.withCredentials = true;
    const response5 = await axiosInstance
      .get("/dashboard/getGroupNames", {
        params: {
          g_id: value,
        },
      })
      .then(
        (response) => {
          //   console.log("from names" + response.data);
          this.state.groupNames.push(response.data);
        },
        () => {
          //   console.log(this.state.groupNames);
        }
      );
  };
  getGroupDetails = async (value) => {
    axiosInstance.defaults.withCredentials = true;
    const response4 = await axiosInstance
      .get("/groups/owe", {
        params: {
          g_id: value,
        },
      })
      .then((response) => {
        console.log(response.data);
        let s = {};
        for (let obj of response.data) {
          if (!s[obj.group_name]) s[obj.group_name] = [];
          s[obj.group_name].push(obj);
        }
        return s;
        // console.log(this.state.groupDetails)
        // this.state.groupDetails.push(response.data);
      });
    return response4;
  };
  getCurrentUserDetails = async () => {
    axiosInstance.defaults.withCredentials = true;
    const response1 = await axiosInstance
      .get("/groups/userDetails", {
        headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
      })
      .then((response) => {
        // console.log(response.data);
        this.setState({
          userDefaultCurrency: response.data.default_currency,
        });
      });
  };
  getUserOweAmount = async () => {
    axiosInstance.defaults.withCredentials = true;
    const response1 = await axiosInstance
      .get("/dashboard/getTotalOwe", {
        headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
      })
      .then((response) => {
        //   console.log(response);
        this.setState({
          userTotalOwe: response.data.owedAmount,
        });
      });
  };
  getUserGetBackAmount = async () => {
    axiosInstance.defaults.withCredentials = true;
    const response1 = await axiosInstance
      .get("/dashboard/getTotalGet", {
        headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
      })
      .then((response) => {
          console.log(response);
        this.setState({
          userTotalGet: response.data.GetBackAmount,
        });
      });
  };
  getUserTotal = () => {
   
    let x = this.state.userTotalGet - this.state.userTotalOwe;
    this.setState({
      userTotalAmount: x,
    });
  };
  async componentDidMount() {
    const r1 = await this.getCurrentUserDetails();
    const r2 = await this.getNumberOfGroups();
    const r3 = await this.getUserOweAmount();
    const r4 = await this.getUserGetBackAmount();
    const r5 = await this.getUserTotal();

    //  this.dispGroupDetails();
    // this.getGroupNames();
  }
  showModal = () => {
    this.setState({
      show: true,
    });
  };

  hideModal = () => {
    this.setState({
      show: false,
    });
  };

  getGroups = async() => {
    axiosInstance.defaults.withCredentials = true;
    let typedGroupName = { g_name: this.state.settleGroupName };
    // console.log("groupname "+this.state.settleGroupName)
    this.setState({
      settleFlag: true
    })
    const response = await axiosInstance
      .post("/mygroups/getGroups", typedGroupName, {
        headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
      })
      .then((response) => {
      
        this.setState({
          settleGroupNameResults: response.data,
        },() =>{console.log(this.state.settleGroupNameResults)});
      });
  };
  getPerson = async() => {
    axiosInstance.defaults.withCredentials = true;
    let typedPersonName = {
      name: this.state.settlePerson,
      g_id: this.state.settleGroupIdToBePassed,
    };
    console.log(typedPersonName)
    this.setState({
      settleFlag: true
    })
   await axiosInstance
      .post("/dashboard/getPerson", typedPersonName, {
        headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
      })
      .then((response) => {
        this.setState(
          {
            settlePersonResults: response.data,
          },
          () => {
            console.log(this.state.settlePersonResults);
          }
        );
      });
  };
  handleGroupNameChange = () => {
    this.setState(
      {
        settleGroupName: this.search.value,
      },
      async() => {
        if (this.state.settleGroupName.length == "")
          this.setState({ settleGroupNameResults: [] });
        if (
          this.state.settleGroupName &&
          this.state.settleGroupName.length >= 1
        ) {
         let c = await this.getGroups();
        }

        //store only when the suggested list length is 1
        if (this.state.settleGroupNameResults.length == 1) {
          //check whether the last suggested name and entered name are same then set state for final values
      
          if (
            this.state.settleGroupName ==
            this.state.settleGroupNameResults[0].name
          ) { 
            this.setState(
              {
                settleGroupIdToBePassed: this.state.settleGroupNameResults[0]
                  .g_id,
                settleGroupNameToBePassed: this.state.settleGroupNameResults[0]
                  .name,
                settleGroupNameResults: []
              },
              () => {
                console.log(this.state.settleGroupIdToBePassed)
              }
            );
          }
        }
      }
    );
  };
  handleGroupMembersChange = () => {
    this.setState(
      {
        settlePerson: this.search2.value,
      },
      async() => {
        if (this.state.settlePerson.length == "")
          this.setState({ settlePersonResults: [] });
        if (this.state.settlePerson && this.state.settlePerson.length >= 1) {
          let c = await this.getPerson();
        }

        for(let i=0;i<this.state.settlePersonResults.length;i++){
          if (
            this.state.settlePerson == this.state.settlePersonResults[i].name
          ) {
            this.setState(
              {
                settlePersonToBePassed: this.state.settlePersonResults[i].name,
                settlePersonIdToBePassed: this.state.settlePersonResults[i]
                  .payer_id,
                  settleFlag: false,
                  settlePersonResults: []
              },
              () => {
                console.log(this.state.settlePersonIdToBePassed);
              }
            );
          }

        }
       
      }
    );
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    console.log("in submit")
  
    // if (
    //   this.state.settleGroupIdToBePassed.length >= 1 &&
    //   this.state.settlePersonIdToBePassed.length >= 1
    // ) 
      let data = {
        payer_id: this.state.settlePersonIdToBePassed,
        g_id: this.state.settleGroupIdToBePassed,
      };
      console.log(data)
      if (Object.values(data).length == 2) {
          axiosInstance.post("/dashboard/settle", data, {
          headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
        }).then((response) => {
            if (response.status === 200) {
              this.setState({
                insertMessage: response.data.msg,
                show: false,
                settleGroupNameResults: [],
                settlePersonResults: [],
                settleFlag: true

              });
            }
            
          }).catch((err) => {
            console.log(err);
            if (err.response.status === 400) {
              this.setState({
                errorMessage: err.response.data.msg,
                errorFlag: true,
                settleGroupNameResults: [],
                settlePersonResults: []
              });
            }
          });
      }
      const r1 = await this.getCurrentUserDetails();
      const r2 = await this.getNumberOfGroups();
      const r3 = await this.getUserOweAmount();
      const r4 = await this.getUserGetBackAmount();
      const r5 = await this.getUserTotal();
    
  };

  render() {
    if(!JSON.parse(localStorage.getItem("user"))){
      return <Redirect to={{
        pathname: '/login',
    }}></Redirect>
    }
    //   console.log(this.state.groupDetails)
    const UserStyle = {
      backgroundColor: "lightgray",
      border: "1px solid rgba(0, 0, 0, 0.05)",
    };
    let amountCheck = (value) => {
      let amount = parseFloat(value);
      if (amount > 1) {
        return ` Owe ${this.state.userDefaultCurrency} ${amount}`;
      } else {
        let newAmount = amount * -1;
        return ` Gets back ${this.state.userDefaultCurrency} ${newAmount}`;
      }
    };
    let nameCheck = (value) => {
      // console.log(value);
      if (value == JSON.parse(localStorage.getItem("user"))?.username) {
        return ` You `;
      } else {
        return ` ${value}`;
      }
    };
    return (
      <div>
        <Container fluid>
          <Row>
            <Col xs="2">
              <Row>
                {" "}
                <Button variant="link" href="./recentactivty">
                  Recent Activity
                </Button>
              </Row>
              <Row>
                {" "}
                <Button variant="link" href="./mygroups">
                  My Groups
                </Button>
              </Row>
            </Col>
            <Col style={{ backgroundColor: "lightgray" }}>
              <h1>DashBoard</h1>
            </Col>
            <Col style={{ backgroundColor: "lightgray" }}>
              <Button variant="success" onClick={this.showModal}>
                {" "}
                Settle Up
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs="2"></Col>
            <Col xs="3" style={UserStyle}>
              <p>total balances</p> {this.state.userDefaultCurrency}{" "}
              {this.state.userTotalAmount}
            </Col>
            <Col xs="3" style={UserStyle}>
              <p> you owe</p> {this.state.userDefaultCurrency}{" "}
              {this.state.userTotalOwe}
            </Col>
            <Col xs="4" style={UserStyle}>
              <p>you are owed</p> {this.state.userDefaultCurrency}{" "}
              {this.state.userTotalGet}
            </Col>
          </Row>

          <Form>
            <Modal show={this.state.show} onHide={this.hideModal}>
              <Modal.Header closeButton>
                <Modal.Title>Settle Up</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <input
                    placeholder="Enter Group Name"
                    type="text"
                    // value={this.state.modalInputName}
                    ref={(input) => (this.search = input)}
                    onChange={(e) => this.handleGroupNameChange(e)}
                    className="form-control"
                  />
                  <DashboardSuggestions
                    settleGroupNameResults={this.state.settleGroupNameResults}
                    isPersonName={false}
                  />
                </div>
                <Row>
                  <Col>
                    <input
                      disabled={this.state.amountChangeFlag}
                      placeholder="To whom you want to settle"
                      type="text"
                      ref={(input) => (this.search2 = input)}
                      onChange={(e) => this.handleGroupMembersChange(e)}
                      className="form-control"
                    />
                    <DashboardSuggestions
                      settlePersonResults={this.state.settlePersonResults}
                      isPersonName={true}
                    />
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.hideModal}>
                  Close
                </Button>
                <Button
                  disabled={this.state.settleFlag}
                  variant="primary"
                  onClick={(e) => this.handleSubmit(e)}
                  type="button"
                  data-dismiss={this.hideModal}
                >
                  Save
                </Button>
              </Modal.Footer>
            </Modal>
          </Form>

          <Row>
            <Col xs="2"></Col>

            <Col
              style={
                ({ border: "1px solid rgba(0, 0, 0, 0.05)" },
                { textAlign: "left" })
              }
            >
              <p>Details about each group</p>

              {this.state.groupDetails.length>0 &&
              this.state.groupDetails.map((group, index) => (
                <div key={index}>
                  <Row>
                    <Col
                      xs="10"
                      style={
                        ({ fontFamily: "italic" },
                        { textTransform: "uppercase" })
                      }
                    >
                      <b>{Object.keys(group)[0]}</b>
                      <br></br>
                    </Col>
                    <Col xs="4">
                      {group[Object.keys(group)[0]] && group[Object.keys(group)[0]].map((detail, index) => (
                        <Row
                          key={index}
                          style={{ textTransform: "capitalize" }}
                        >
                          {nameCheck(detail.name)}
                          {amountCheck(detail.amount_owed)}
                        </Row>
                      ))}
                    </Col>
                  </Row>
                </div>
              ))}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Dashboard;
