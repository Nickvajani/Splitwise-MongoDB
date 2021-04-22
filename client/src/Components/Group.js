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
import axiosInstance from "../helpers/axios";
import { connect } from "react-redux";
import { GroupsAction } from "../redux/group/groupAction";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

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
      showComment: false,
      IdForComment: '',
      commentForExpense:'',
      commentFlag: true,
      commentToSave: '',
      viewComment: false,
      commentsFetched: [],
      deleteFlag: false,
      deleteMessage: "",
      idToDelete:'',
      deleteModal: false
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.groupProps !== this.props.groupProps) {
      if (this.props.groupProps.Obj) {
        this.setState({
          transactionDetails: this.props.groupProps.Obj.transactionDetails,
        });
      }
      if (this.props.groupProps.user) {
        this.setState({
          userDefaultCurrency: this.props.groupProps.user.userDefaultCurrency,
        });
      }
      if (this.props.groupProps.groupNameDetails) {
        this.setState({
          groupname: this.props.groupProps.groupNameDetails.groupname,
        });
      }
      if (this.props.groupProps.oweObject) {
        this.setState({
          owerObject: this.props.groupProps.oweObject.owerObject,
        });
      }
      if (this.props.groupProps.insertFlag) {
        console.log(this.props.groupProps.insertFlag)
        this.setState(
          {
            insertFlag: true,
            show: false,
            insertMessage: "Added Successfully",
          },
          () => {
            console.log(this.state.insertFlag)
            this.getGroupExpense();
            this.getOweDetails();
          }
        );
      }
      if(this.props.groupProps.errorFlag){
        this.setState({
          errorFlag:true,
          errorMessage: "Not Added"
        })
      }
      if(this.props.groupProps.insertCommentFlag){
        this.setState({
          showComment:false,
          insertFlag: true,
          insertMessage: "Comment Added Successfully",
        },() => {
          console.log("added")
          this.getGroupExpense();

        })
      }
      if(this.props.groupProps.deleteCommentFlag){
        this.setState({
          deleteModal: false,
          viewComment: false,
          deleteFlag: true,
          deleteMessage: "Comment Deleted Successfully",
        },()=>{
          console.log(this.state.deleteMessage)
          this.getGroupExpense()
        })
      }
    }
  }
  componentDidMount(props) {
    this.setState({
      group_id: this.props.location.state.g_id,
      groupname: this.props.location.state.name
    });
    this.getGroupExpense();
    this.getCurrentUserDetails();
    // this.getCurrentGroupDetails();
    this.getOweDetails();
  }
  getGroupExpense = () => {
    let data = this.props.location.state.g_id;
    this.props.getGroupExpense(data);
  };

  getCurrentUserDetails = () => {
    this.props.getUserDetails();
  };

  // getCurrentGroupDetails = () => {
  //   let data = this.props.location.state.g_id;
  //   this.props.groupDetails(data);
  // };
  getOweDetails = () => {
    let data = this.props.location.state.g_id;
    this.props.getOweDetails(data);
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

  showModal = () => {
    this.setState({
      show: true,
    });
  };

  showCommentModal =(e,ID) =>{
    e.preventDefault();
    this.setState({
      IdForComment: ID,
      showComment: true
    },()=>{console.log(this.state.IdForComment)})
  }
  hideCommentModal = () =>{
    this.setState({
      showComment:false,
      IdForComment: '',
      commentFlag: true
    },()=>{console.log(this.state.IdForComment)})
  }
  hideViewCommentModal= () =>{
    this.setState({
      viewComment: false
    })
  }
  hideDeleteConfirmationModal =()=>{
    this.setState({
      deleteModal:false
    })
  }
  hideModal = () => {
    this.setState({
      show: false,
    });
  };

  handleCommentChange(e){
    this.setState({
      commentForExpense: e.target.value
    },() => {
      if(e.target.value.length>0){
        this.setState({
          commentFlag: false
        })
      }else{
        this.setState({
          commentFlag: true
        })
      }
    })

  }


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

  handleCommentSubmit = (e) =>{
    e.preventDefault();
    if(this.state.commentForExpense.length >=1){
      this.setState({
        commentToSave: this.state.commentForExpense
      },async() => {
        let data = {
          t_id: this.state.IdForComment,
          comment: this.state.commentToSave
        }
        this.props.addComment(data)
      })
    }
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
            group_id: this.state.group_id
          };
          console.log(data);
          console.log(Object.values(data).length);
          if (Object.values(data).length == 4) {
            this.props.addExpense(data);
          }
        }
      );
    }
  };
  viewComment = (e,comments) =>{
    e.preventDefault();
    this.setState({
      viewComment: true,
      commentsFetched: comments
    },()=>{
      console.log(this.state.commentsFetched)
    })
  }
  deleteComfirmation = async(e,id)=>{
    this.setState({
      idToDelete: id,
      deleteModal:true
    })

  }


  deleteComment =async(e,id)=>{
    e.preventDefault();
    console.log(id)
    let data = {
      c_id: id,
    };
    this.props.deleteComment(data)
    // axiosInstance.defaults.withCredentials = true;
    // axiosInstance.defaults.headers.common['authorization'] = localStorage.getItem('token');
    // const response4 = await axiosInstance
    //   .delete("/groups/deleteComment/" + data.c_id,  {
    //     headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
    //   })
    //   .then((response) => {
    //     this.setState({
    //       viewComment: false
    //     },()=>{this.getGroupExpense()});
    //   });


  }
  render() {
    const renderSuccess = () => {
      if (this.state.insertFlag) {
        return <Alert variant="success ">{this.state.insertMessage}</Alert>;
      }
      setTimeout(() => {
        this.setState({
          insertFlag: false,
        });
      }, 10000);
    };
    const renderDelete = () =>{
    if (this.state.deleteFlag) {
      return <Alert variant="success ">{this.state.deleteMessage}</Alert>;
    }
    setTimeout(() => {
      this.setState({
        deleteFlag: false,
      });
    }, 10000);
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
      if (amount >=1) {
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
      textTransform: "uppercase",
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
              {renderSuccess()}
              {renderDelete()}
          <Form >
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
                {renderError()}
                {renderSuccess()}
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



            <Modal show={this.state.showComment} onHide={this.hideCommentModal}>
              <Modal.Header closeButton>
                <Modal.Title>Add a Note</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="form-group">
                  <input
                    placeholder="Enter the note...."
                    type="text"
                    // value={this.state.modalInputName}

                    onChange={(e) => this.handleCommentChange(e)}
                    className="form-control"
                    required
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                {renderError()}
                {renderSuccess()}
                <Button variant="secondary" onClick={this.hideCommentModal}>
                  Close
                </Button>
                <Button
                  disabled={this.state.insertcommentFlag}
                  variant="primary"
                  onClick={(e) => this.handleCommentSubmit(e)}
                  type="button"
                  data-dismiss={this.hideCommentModal}
                >
                  Save
                </Button>
              </Modal.Footer>
            </Modal>
            


            <Modal show={this.state.viewComment} onHide={this.hideViewCommentModal}>
              <Modal.Header closeButton>
                <Modal.Title>Comments</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {this.state.commentsFetched.length>0 && 
                this.state.commentsFetched.map((comments,index) => (
                  <div>
                   
                    <Row  style={{ border: "1px solid rgba(0, 0, 0, 0.05)" }}>
                      <Col xs="2" style={{textAlign:"left"}}>{comments.name}:</Col>
                      <Col xs="6" style={{textAlign:"left"}}>{comments.comment}</Col>
                      <Col xs="2">{this.convertDate(comments.created_at)}</Col>
                      <Col xs="1">{String(comments.name) == String(JSON.parse(localStorage.getItem("user"))?.username)?<FontAwesomeIcon icon={faTrash} onClick={(e) =>{this.deleteComfirmation(e,comments.id)}}/>:null}</Col>
                    </Row>
                  </div>
                ))}
              </Modal.Body>
              <Modal.Footer>
                {renderError()}
                {renderSuccess()}
                <Button variant="secondary" onClick={this.hideViewCommentModal}>
                  Close
                </Button>
               
              </Modal.Footer>
            </Modal>

            <Modal show={this.state.deleteModal} onHide={this.hideDeleteConfirmationModal}>
                <Modal.Header closeButton>
                <Modal.Title>Delete Comment</Modal.Title>
              </Modal.Header>
              <Modal.Body>
              Permanently delete this comment?<br></br>
                <Button variant="secondary" style={{marginRight:"10px"}} onClick={this.hideDeleteConfirmationModal}>
                  NO
                </Button>
                <Button variant="secondary" onClick={(e) =>{this.deleteComment(e,this.state.idToDelete)}}>
                  yes
                </Button>
              </Modal.Body>
              <Modal.Footer>
                {renderError()}
                {renderSuccess()}
               
              </Modal.Footer>
            </Modal>
           
          </Form>
          <Row>
            <Card style={{ width: "50rem" }}>
              <Card.Body>
                {this.state.transactionDetails.length > 0 &&
                  this.state.transactionDetails.map((group, index) => (
                    <div key={index}>
                      <Row style={{ border: "1px solid rgba(0, 0, 0, 0.05)" }} >
                        <Col xs="3" onClick={(e) =>{this.showCommentModal(e,group.ID)}}>{this.convertDate(group.created_at)}</Col>
                        <Col xs="3" onClick={(e) =>{this.showCommentModal(e,group.ID)}} style={{ textTransform: "uppercase" }}>
                          {group.description}
                        </Col>
                        <Col xs="3" style={{ textTransform: "uppercase" }} onClick={(e) =>{this.showCommentModal(e,group.ID)}}>
                          <small>{group.payer_name} paid</small>
                          <br></br>
                          {this.state.userDefaultCurrency} {group.amount}
                        </Col>
                        <Col>
                        <Button variant="primary"
                        size="sm"
                        onClick={(e) => {
                          this.viewComment(e, group.comments);
                        }}>
                          View Comments
                        </Button>
                        </Col>
                      </Row>
                    </div>
                  ))}
              </Card.Body>
            </Card>
            <Col sm={3}>
              <b>Group Balances</b>

              {this.state.owerObject.length > 0 &&
                this.state.owerObject.map((group, index) => (
                  <div key={index}>
                    <Row>
                      <Col xs="10" style={OwerStyle}>
                        <small>
                          <b>{group.name}</b>
                          <br></br>
                        </small>
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

const mapStateToProps = (state, props) => {
  return {
    groupProps: state.groupState,
  };
};

const actionCreators = {
  getGroupExpense: GroupsAction.groupExpense,
  getUserDetails: GroupsAction.currentUserDetails,
  groupDetails: GroupsAction.groupDetails,
  getOweDetails: GroupsAction.groupOweDetails,
  addExpense: GroupsAction.addExpense,
  addComment: GroupsAction.addComment,
  deleteComment:  GroupsAction.deleteComment
};
export default connect(mapStateToProps, actionCreators)(Group);
