import React, { Component } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import axiosInstance from "../helpers/axios"

class RecentActivity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      recentActivityDetails: [],
    };
  }
  getCurrentUserDetails = async () => {
    axiosInstance.defaults.withCredentials = true;
    const response1 = await axiosInstance
      .get(
        "/groups/userDetails",
        {
          headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
        }
      )
      .then((response) => {
        console.log(response.data);
        this.setState({
          userDefaultCurrency: response.data.default_currency,
        });
      });
  };
  getRecentActivity = async () => {
    axiosInstance.defaults.withCredentials = true;
    const response1 = await axiosInstance
      .get(
        "/recentActivity",
        {
          headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
        }
      )
      .then((response) => {
        console.log(response.data);
        this.setState({
          recentActivityDetails: response.data,
        });
      });
  };

  async componentDidMount() {
    const r2 = await this.getCurrentUserDetails();
    const r1 = await this.getRecentActivity();
  }
  render() {
    let amountCheck = (value) => {
      let amount = parseFloat(value);
      if (amount >= 1) {
        return ` You Owe ${this.state.userDefaultCurrency}${amount}`;
      } else if(amount<0){
        let newAmount = amount * -1;
        return `You Get back ${this.state.userDefaultCurrency}${newAmount}`;
      }else{
        return ` This transaction is settled`;

      }
    };
    let checkName = (value) => {
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
                <Button variant="link" href="./recentactivty">
                  Recent Activity
                </Button>
              </Row>
              <Row>
                <Button variant="link" href="./mygroups">
                  My Groups
                </Button>
              </Row>
            </Col>
            <Col  xs="3" style={{ backgroundColor: "lightgray" }}>
              <h3>Recent Activity</h3>
              
            </Col>
            <Col xs="1" style={{ backgroundColor: "lightgray" }}>
            Filter by{" "}
            </Col>
            <Col xs="2"style={{ backgroundColor: "lightgray" }}> 
              <DropdownButton
                id="dropdown-basic-button"
                title="Groups"
              >
                <Dropdown.Item >Farewell Party</Dropdown.Item>
                <Dropdown.Item >Another action</Dropdown.Item>
                <Dropdown.Item >Something else</Dropdown.Item>
              </DropdownButton>
            </Col>
            <Col xs="1" style={{ backgroundColor: "lightgray" }}>
            Sort by{" "}
            </Col>
            <Col xs="3"style={{ backgroundColor: "lightgray" }}> 
              <DropdownButton
                id="dropdown-basic-button"
                title="Most recent on top"
              >
                <Dropdown.Item >Farewell Party</Dropdown.Item>
                <Dropdown.Item >Another action</Dropdown.Item>
                <Dropdown.Item >Something else</Dropdown.Item>
              </DropdownButton>
            </Col>
            
          </Row>
          <Row>
            <Col xs="2"></Col>
            <Col style={{ textAlign: "left" }}>
              {this.state.recentActivityDetails.length>0 &&
              this.state.recentActivityDetails.map((group, index) => (
                <div key={index}>
                  <Row
                    xs="10"
                    style={{ border: "1px solid rgba(0, 0, 0, 0.09)" }}
                  >
                    <Col style={{ textTransform: "capitalize" }}>
                      <small>
                        <b>{checkName(group.payerName)}</b> added{" "}
                        <b>"{group.description}"</b> in{" "}
                        <b>"{group.groupName}"</b>
                        <br></br>
                      </small>
                      <p style={{ color: "red" }}>
                        {" "}
                        <small>{amountCheck(group.amount)}</small>
                      </p>
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

export default RecentActivity;