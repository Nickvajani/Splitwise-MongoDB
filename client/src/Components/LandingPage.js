import Carousel from "react-bootstrap/Carousel";
import React, { Component } from "react";
import l1 from '../l1.png'
import l2 from '../l2.png'
import l3 from '../l3.png'
import "./LandingPage.css";
import axiosInstance from "../helpers/axios"

class LandingPage extends Component {
  render() {
    return (
      <div>
        <Carousel>
          <Carousel.Item interval={1000} style={{'height':"900px"}}>
            <img
              className="d-block w-100"
              src={l1}
              alt="First slide"
            />
            
          </Carousel.Item>

          <Carousel.Item interval={500}style={{'height':"900px"}}>
            <img
              className="d-block w-100"
              src={l2}
              alt="Second slide"
            />
           
          </Carousel.Item>

          <Carousel.Item style={{'height':"900px"}}>
            <img
              className="d-block w-100"
              src={l3}
              alt="Third slide"
            />
            
          </Carousel.Item>
        </Carousel>
      </div>
    );
  }
}

export default LandingPage;
