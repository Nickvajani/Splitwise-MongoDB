import axiosInstance from "../helpers/axios";

export const groupService = {
  groupExpense,
  userDetails,
  groupDetails,
  groupOweDetails,
  addExpense,
  addComment,
  deleteComment
};

async function groupExpense(data) {
  let id = data;
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));

  const response = await axiosInstance
    .get("/groups/expenses", {
      params: {
        g_id: id,
      },
    })
    .then((response) => {
      //console.log(response.data);
      let Obj = {
        transactionDetails: response.data,
      };
      return Obj;
    });
  return response;
}
async function userDetails() {
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));

  const response = await axiosInstance
    .get("/groups/userDetails", {
      headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
    })
    .then((response) => {
      let user = {
        userDefaultCurrency: response.data.default_currency,
      };
      return user;
    });
  return response;
}
//removed 
async function groupDetails(data) {
  let id = data;
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));

  const response = await axiosInstance
    .get("/groups/groupDetails", {
      params: {
        g_id: id,
      },
    })
    .then((response) => {
      let groupNameDetails = {
        groupname: response.data,
      };
      return groupNameDetails;
    });
  return response;
}
async function groupOweDetails(data) {
  let id = data;
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));

  const response = axiosInstance
    .get("/groups/owe", {
      params: {
        g_id: id,
      },
    })
    .then((response) => {
      let owerObject = {
        owerObject: response.data,
      };
      return owerObject;
    });
  return response;
}

async function addExpense(data) {
    let id = data.group_id;
    console.log(data)
    axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));
  const response = axiosInstance
    .post("/groups/addExpense/" + id, data, {
      headers: {
        user: JSON.parse(localStorage.getItem("user"))?.u_id,
      },
    })
    .then((response) => {
      let user = {
        insertMessage: "Expense Added",
      };
      return user;
    });

  return response;
}

async function addComment(data) {
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));

        const response = await axiosInstance.post("/groups/comment" ,data,{
          headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
        }).then((response) => {
          let comment ={
            insertComment: "Comment Added"
          }
          return comment
        })
        return response
}
async function deleteComment(data) {
  axiosInstance.defaults.withCredentials = true;
  axiosInstance.defaults.headers.common['authorization'] = JSON.parse(localStorage.getItem('token'));
    const response = await axiosInstance
      .delete("/groups/deleteComment/" + data.c_id,  {
        headers: { user: JSON.parse(localStorage.getItem("user"))?.u_id },
      })
      .then((response) => {
       let deleteDetails ={
        message: "comment deleted"
       }
       return deleteDetails
        // this.setState({
        //   viewComment: false
        // },()=>{this.getGroupExpense()});
      });
      return response
}


