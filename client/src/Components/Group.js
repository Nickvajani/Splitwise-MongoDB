import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import "./Group.css";
import Button from "react-bootstrap/Button";
import axios from "axios";
// import Modal from "./Modal"
import { Form, Modal } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import axiosInstance from "../helpers/axios"

class Group extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groupname: "",
      userDefaultCurrency: "",
      group_id: 0,
      transactionDetails: [],
      show: false,
      modalDescription: "",
      descriptionToSave: "",
      modalAmount: 0,
      amountToSave: 0,
      saveFlag: true,
      amountChangeFlag: true,
      errorMessage: "",
      errorFlag: false,
      insertedMessage: "",
      insertFlag: false,
      owerObject: [],
    };
  }
  getGroupExpense = () => {
    axiosInstance.defaults.withCredentials = true;
    const response = axiosInstance
      .get("/groups/expenses", {
        params: {
          g_id: this.props.location.state.g_id,
        },
      })
      .then((response) => {
        //console.log(response.data);
        this.setState({
          transactionDetails: response.data,
        });
      });
  };

  getCurrentUserDetails = () => {
    axiosInstance.defaults.withCredentials = true;
    const response1 = axiosInstance
      .get("/groups/userDetails", {
        headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
      })
      .then((response) => {
        this.setState({
          userDefaultCurrency: response.data.default_currency,
        });
      });
  };
  getCurrentGroupDetails = () => {
    axiosInstance.defaults.withCredentials = true;
    const response3 = axiosInstance
      .get("/groups/groupDetails", {
        params: {
          g_id: this.props.location.state.g_id,
        },
      })
      .then((response) => {
        console.log(typeof(response.data));
        this.setState({
          groupname: response.data,
        });
      });
  };
  getOweDetails = () => {
    axiosInstance.defaults.withCredentials = true;
    const response4 = axiosInstance
      .get("/groups/owe", {
        params: {
          g_id: this.props.location.state.g_id,
        },
      })
      .then((response) => {
        console.log(response.data);
        this.setState({
          owerObject: response.data,
        });
      });
  };
  convertDate = (updatedAt) => {
    const date = new Date(updatedAt);
    // const nowdate = new Date();
    // const diff = nowdate.getTime() - date.getTime();
    // const hours = Math.trunc(diff / 1000 / 60 / 60);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return `${day} ${monthNames[monthIndex]}`;
  };

  componentDidMount(props) {
    this.setState({
      group_id: this.props.location.state.g_id,
    });
    this.getGroupExpense();
    this.getCurrentUserDetails();
    this.getCurrentGroupDetails();
    this.getOweDetails();
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
  handleDescriptionChange(e) {
    this.setState(
      {
        modalDescription: e.target.value,
      },
      () => {
        if (e.target.value.length > 0) {
          this.setState({
            amountChangeFlag: false,
          });
        } else {
          this.setState({
            amountChangeFlag: true,
          });
        }
      }
    );
  }
  handleAmountChange(e) {
    this.setState(
      {
        modalAmount: e.target.value,
      },
      () => {
        if (
          this.state.modalDescription.length >= 1 &&
          this.state.modalAmount.length >= 1
        ) {
          this.setState({
            saveFlag: false,
          });
        } else {
          this.setState({
            saveFlag: true,
          });
        }
      }
    );
  }
  handleSubmit = (e) => {
    e.preventDefault();
    if (
      this.state.modalDescription.length >= 1 &&
      this.state.modalAmount != 0
    ) {
      this.setState(
        {
          descriptionToSave: this.state.modalDescription,
          amountToSave: this.state.modalAmount,
        },
        () => {
          let data = {
            amount: this.state.amountToSave,
            currency: this.state.userDefaultCurrency,
            description: this.state.descriptionToSave,
          };
          console.log(data);
          console.log(Object.values(data).length);
          if (Object.values(data).length == 3) {
            const response4 = axiosInstance
              .post(
                "/groups/addExpense/" + this.state.group_id,
                data,
                {
                  headers: {
                    user: JSON.parse(localStorage.getItem("user"))?.u_id,
                  },
                }
              )
              .then((response) => {
                // console.log(response.data.msg);
                if (response.status === 200) {
                  this.setState({
                    insertMessage: response.data.msg,
                    insertFlag: true,
                    show: false,
                  },()=>{
                    console.log(this.state.insertMessage)
                  });
                }
                this.getGroupExpense();
                this.getOweDetails();
              })
              .catch((err) => {
                console.log(err);
                if (err.response.status === 500) {
                  this.setState({
                    errorMessage: err.response.data.msg,
                    errorFlag: true,
                  });
                }
              });
          }
        }
      );
    }
  };
  render() {
    const renderSuccess = () => {
      if (this.state.insertFlag) {
        return <Alert variant="danger ">{this.state.insertMessage}</Alert>;
      }
      setTimeout(() => {
        this.setState({
          insertFlag: false,
        });
      }, 15000);
    };

    const renderError = () => {
      if (this.state.errorFlag) {
        return <Alert variant="danger">{this.state.errorMessage}</Alert>;
      }
      setTimeout(() => {
        this.setState({
          errorFlag: false,
        });
      }, 10000);
    };

    let amountCheck = (value) => {
      let amount = parseFloat(value);
      if (amount > 1) {
        return ` Owes ${this.state.userDefaultCurrency}${amount}`;
      } else {
        let newAmount = amount * -1;
        return ` Gets back ${this.state.userDefaultCurrency}${newAmount}`;
      }
    };

    const OwerStyle = {
      textAlign: "left",
      fontFamily: "Arial",
      fontWeight: "bold",
      textTransform: "uppercase"
    };
    
    return (
      <div>
        <Container fluid>
          <Row>
            <Col
              sm={5}
              style={({ fontWeight: "bold" }, { backgroundColor: "lightgray" })}
            >
              <p style={{ textTransform: "uppercase" }}>
                <big>{this.state.groupname}</big>
              </p>
            </Col>
            <Col sm={4} style={{ backgroundColor: "lightgray" }}>
              <Button variant="danger" onClick={this.showModal}>
                Add Expense
              </Button>
            </Col>
            
          </Row>
          <Form>
            <Modal show={this.state.show} onHide={this.hideModal}>
              <Modal.Header closeButton>
                <Modal.Title>Add an expense</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <input
                    placeholder="Enter the description...."
                    type="text"
                    // value={this.state.modalInputName}

                    onChange={(e) => this.handleDescriptionChange(e)}
                    className="form-control"
                    required
                  />
                </div>
                <Row>
                  <Col xs="1">
                    <p>{this.state.userDefaultCurrency}</p>
                  </Col>
                  <Col>
                    <input
                      disabled={this.state.amountChangeFlag}
                      placeholder="0.00"
                      type="number"
                      // value={this.state.modalInputName}

                      onChange={(e) => this.handleAmountChange(e)}
                      className="form-control"
                      required
                    />
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                {renderError()}{renderSuccess()}
                <Button variant="secondary" onClick={this.hideModal}>
                  Close
                </Button>
                <Button
                  disabled={this.state.saveFlag}
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
            <Card style={{ width: "50rem" }}>
              <Card.Body>
                { this.state.transactionDetails.length>0 &&
                this.state.transactionDetails.map((group, index) => (
                  <div key={index}>
                    <Row style={{ border: "1px solid rgba(0, 0, 0, 0.05)" }}>
                      <Col xs="3">{this.convertDate(group.created_at)}</Col>
                      <Col xs="3" style={{ textTransform: "uppercase" }}>
                        {group.description}
                      </Col>
                      <Col xs="3" style={{ textTransform: "uppercase" }}>
                        <small>{group.payer_name} paid</small>
                        <br></br>
                        {this.state.userDefaultCurrency} {group.amount}
                      </Col>
                    </Row>
                  </div>
                ))}
              </Card.Body>
            </Card>
            <Col sm={3}>
              <b>Group Balances</b>

              {this.state.owerObject.length>0 &&
              this.state.owerObject.map((group, index) => (
                <div key={index}>
                  <Row >
                    <Col xs="10" style={OwerStyle}>
                    <small><b>{group.name}</b><br></br></small>
                  <small>{amountCheck(group.amount_owed)}</small>
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

export default Group;
