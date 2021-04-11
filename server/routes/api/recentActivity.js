const express = require("express");
const router = express.Router();

let User = require("../../models/userModel");
let Group = require("../../models/createGroupModel");
let Transaction = require("../../models/transactionModel");

router.get("/", async (req, res) => {
  var current_user = req.header("user");
  try {
    let listOfGroupId = await new Promise((resolve, reject) => {
      Group.find(
        { "members.ID": current_user, "members.is_accepted": true },
        (err, result) => {
          if (err) {
            console.log(err);
          } else {
            groupMembers = [];
            for (i = 0; i < result.length; i++) {
              groupMembers[i] = result[i]._id;
            }
            resolve(groupMembers);
          }
        }
      );
    });
    console.log(listOfGroupId);
    let outerTransactions = [];
    await Promise.all(
      listOfGroupId.map(async (group) => {
        const contents = await everyTransactionDetails(group, current_user);
       console.log("from contents")
        console.log(contents)
        outerTransactions = [...outerTransactions, ...contents];
      })
    );
    console.log("outer")
    console.log(outerTransactions)
    res.send(outerTransactions);
  } catch (error) {}
  // Transaction.find({})
});

const everyTransactionDetails = async (myGroupNo, current_user) => {
  let promiseResult = await new Promise((resolve, reject) => {
    Transaction.find({ g_id: myGroupNo })
      .populate({ path: "g_id" })
      .populate({ path: "payer_id" })
      .then((result) => {
        if (result.length > 0) {
          let groupsTransactionDetails = [];
          for (i = 0; i < result.length; i++) {

            if (result[i].payer_id._id == current_user) {
              let getBackAmount = 0;
              for (j = 0; j < result[i].ower.length; j++) {
                if (result[i].ower[j].is_settled == false) {
                  getBackAmount += result[i].ower[j].amount;
                }
              }
              let eachTransaction = {
                amount: -(getBackAmount),
                payerName: result[i].payer_id.name,
                description: result[i].description,
                groupName: result[i].g_id.g_name,
                created_at: result[i].createdAt,
                updated_at: result[i].updatedAt,
              };
              groupsTransactionDetails.push(eachTransaction);
            } else {
                for(j=0;j<result[i].ower.length;j++){
                    if(result[i].ower[j].u_id == current_user ){
                        //if not settled
                        if(result[i].ower[j].is_settled == false){
                            let eachTransaction = {
                              amount: result[i].ower[j].amount,
                              payerName: result[i].payer_id.name,
                              description: result[i].description,
                              groupName: result[i].g_id.g_name,
                              created_at: result[i].createdAt,
                              updated_at: result[i].updatedAt,
                            };
                            groupsTransactionDetails.push(eachTransaction);
                        }else{
                            //this else part shows that the transaction was settled by the current user
                            let eachTransaction = {
                                amount: 0,
                                payerName: result[i].payer_id.name,
                                description: result[i].description,
                                groupName: result[i].g_id.g_name,
                                created_at: result[i].createdAt,
                                updated_at: result[i].updatedAt,
                              };
                              groupsTransactionDetails.push(eachTransaction);
                        }

                    }
                }
            }
          }
        //   console.log(groupsTransactionDetails);
          resolve(groupsTransactionDetails)
        }

      });
  });
  return promiseResult
};

module.exports = router;