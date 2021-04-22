const express = require("express");
const router = express.Router();
const { checkAuth } = require("../../config/passport");
var kafka = require("../../kafka/client");

let User = require("../../models/userModel");
let Group = require("../../models/createGroupModel");
let Transaction = require("../../models/transactionModel");

router.get("/userDetails", checkAuth, (req, res) => {
  var current_user = req.header("user");

  kafka.make_request("user_details", current_user, function (err, results) {
    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      console.log("Inside router post");
      res.send(results);
    }
  });

  // User.find({ _id: current_user }, (err, result) => {
  //   if (err) {
  //     res.status(500).json({ msg: err });
  //   } else {
  //     let curr = {
  //       default_currency: result[0].defaultCurrency,
  //     };
  //     res.status(200).send(curr);
  //   }
  // });
});

//removed
router.get("/groupDetails", checkAuth, (req, res) => {
  var group_id = req.query.g_id;
  Group.find({ _id: group_id }, (err, result) => {
    if (err) {
      res.status(500).json({ msg: err });
    } else {
      res.status(200).send(result[0].g_name);
    }
  });
});

router.get("/expenses", checkAuth, (req, res) => {
  var group_id = req.query.g_id;

  kafka.make_request("group_expense", group_id, function (err, results) {
    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      console.log("Inside router post");
      res.send(results);
    }
  });

  // Transaction.find({ g_id: group_id })
  //   .populate({ path: "g_id" })
  //   .populate({path: "comments.u_id"})
  //   .populate({ path: "payer_id" })
  //   .sort({ createdAt: -1 })
  //   .then((user) => {
  //     let group_details = [];
  //     for (let i = 0; i < user.length; i++) {
  //       let comments = []
  //       // if(user[i].comments){
  //       //   console.log(user[i].comments.length)
  //       // }
  //       for(j=0;j<user[i].comments.length;j++){
  //         let commentObj ={
  //           id: user[i].comments[j]._id,
  //           name: user[i].comments[j].u_id.name,
  //           comment: user[i].comments[j].comment,
  //           created_at: user[i].comments[j].created_at
  //         }
  //         // console.log(commentObj)
  //         comments.push(commentObj)
  //       }
  //       let obj = {
  //         ID: user[i]._id,
  //         amount: user[i].amount,
  //         payer_name: user[i].payer_id.name,
  //         description: user[i].description,
  //         created_at: user[i].createdAt,
  //         comments: comments
  //       };
  //       group_details.push(obj);
  //     }
  //     // console.log(group_details)
  //     res.send(group_details);
  //   });
});

router.get("/owe", checkAuth, async (req, res) => {
  // console.log("owe called");
  var group_id = req.query.g_id;

  kafka.make_request("owe_details", group_id, function (err, results) {
    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      console.log("Inside router post");
      console.log(results);
      res.send(results);
    }
  });

  // try {
  //   let memberList = await new Promise((resolve, reject) => {
  //     Group.find({ _id: group_id }, (err, result) => {
  //       if (err) {
  //         res.status(500).json({ msg: err });
  //       } else {
  //         let members = [];
  //         for (i = 0; i < result[0].members.length; i++) {
  //           if (result[0].members[i].is_accepted) {
  //             members[i] = result[0].members[i].ID;
  //             // owers.push(result[0].members[i].ID);
  //           }
  //         }
  //         resolve(members);
  //       }
  //     });
  //   });
  //   // console.log(memberList);
  //   let totalAmounts = []; //contains each member ower amount
  //   for (z = 0; z < memberList.length; z++) {
  //     let owersObj = await new Promise((resolve, reject) => {
  //       Transaction.find({
  //         g_id: group_id,
  //         "ower.u_id": memberList[z],
  //         "ower.is_settled": false,
  //       })
  //         .populate({ path: "g_id" })
  //         .populate({ path: "payer_id" })
  //         .populate({ path: "ower.u_id" })
  //         .then((user) => {
  //           if (user.length > 0) {
  //             let amounts = {};
  //             amounts["amount_owed"] = 0.0;
  //             // amounts["group_name"] = user[0].g_id.g_name
  //             for (let i = 0; i < user.length; i++) {
  //               for (let j = 0; j < user[i].ower.length; j++) {
  //                 if (
  //                   String(user[i].ower[j].u_id._id) ===
  //                     String(memberList[z]) &&
  //                   user[i].ower[j].is_settled == false
  //                 ) {
  //                   amounts["name"] = user[i].ower[j].u_id.name;
  //                   amounts["ower_id"] = user[i].ower[j].u_id._id;
  //                   amounts["amount_owed"] += user[i].ower[j].amount;
  //                   amounts["group_name"] = user[0].g_id.g_name;
  //                 }
  //               }
  //             }
  //             resolve(amounts);
  //           } else {
  //             resolve(null);
  //           }
  //         });
  //     });
  //     if (owersObj != null) {
  //       totalAmounts.push(owersObj);
  //     }
  //   }
  //   // console.log("Owe details")
  //   // console.log(totalAmounts);
  //   //to find the users who are just the payers and do not owe anything
  //   let res4 = await new Promise(async (resolve, reject) => {
  //     let newMembers = [];
  //     let newMembersObj = {};
  //     for (i = 0; i < memberList.length; i++) {
  //       let found = 0;
  //       for (j = 0; j < totalAmounts.length; j++) {
  //         if (String(memberList[i]) == String(totalAmounts[j].ower_id)) {
  //           found = 1;
  //           break;
  //         }
  //       }
  //       if (!found) newMembers.push(memberList[i]);
  //     }

  //     // newMembers will have an id of 1 user
  //     if (newMembers.length > 0) {
  //       Transaction.find({ g_id: group_id, payer_id: newMembers[0] })
  //         .populate({ path: "g_id" })
  //         .populate({ path: "payer_id" })
  //         .then((result) => {
  //           if (result.length >= 1) {
  //             newMembersObj = {
  //               amount_owed: 0,
  //               name: result[0].payer_id.name,
  //               group_name: result[0].g_id.g_name,
  //             };
  //             resolve(newMembersObj);
  //           } else {
  //             resolve(null);
  //           }
  //         });
  //     } else {
  //       resolve(null);
  //     }
  //   });

  //   if (res4 != null) {
  //     if (Object.keys(res4).length != 0) {
  //       totalAmounts.push(res4);
  //     }
  //   }

  //   let payerAmount = [];
  //   for (z = 0; z < memberList.length; z++) {
  //     let payersObj = await new Promise((resolve, reject) => {
  //       Transaction.find({ g_id: group_id, payer_id: memberList[z] })
  //         .populate({ path: "g_id" })
  //         .populate({ path: "payer_id" })
  //         .populate({ path: "ower.u_id" })
  //         .then((user) => {
  //           if (user.length > 0) {
  //             let amounts = {};
  //             amounts["amount_toGetBack"] = 0.0;
  //             //   amounts["sumOfOwers"] = 0.0;
  //             // console.log(user[0])
  //             for (let i = 0; i < user.length; i++) {
  //               if (String(user[i].payer_id._id) === String(memberList[z])) {
  //                 for (j = 0; j < user[i].ower.length; j++) {
  //                   if (user[i].ower[j].is_settled == false) {
  //                     amounts["amount_toGetBack"] += user[i].ower[j].amount;
  //                   }
  //                 }
  //                 //   console.log(amounts)
  //                 //   console.log(user[i].amount)
  //                 amounts["name"] = user[i].payer_id.name;
  //                 amounts["payer_id"] = user[i].payer_id._id;
  //                 //   amounts["amount_toGetBack"] = user[i].amount - amounts["sumOfOwers"];
  //                 amounts["group_name"] = user[0].g_id.g_name;
  //               }
  //             }
  //             resolve(amounts);
  //           } else {
  //             resolve(null);
  //           }
  //         });
  //     });
  //     if (payersObj != null) {
  //       payerAmount.push(payersObj);
  //     }
  //   }
  //   // console.log("payerAmount")
  //   // console.log(payerAmount);
  //   if (payerAmount != null && totalAmounts != null) {
  //     for (i = 0; i < totalAmounts.length; i++) {
  //       for (j = 0; j < payerAmount.length; j++) {
  //         if (payerAmount[j].name == totalAmounts[i].name) {
  //           totalAmounts[i].amount_owed -= payerAmount[j].amount_toGetBack;
  //         } else {
  //         }
  //       }
  //     }
  //   }
  //   // console.log(totalAmounts);
  //   res.status(200).send(totalAmounts);
  // } catch (error) {
  //   res.status(400).json({ msg: err });
  // }
});
router.post("/addExpense/:g_id", checkAuth, async (req, res) => {
  console.log("adding");
  var current_user = req.header("user");
  var group_id = req.params.g_id;
  var data = {
    group_id: group_id,
    current_user: current_user,
    amount: req.body.amount,
    currency: req.body.currency,
    description: req.body.description,
  };

  kafka.make_request("add_expense", data, function (err, results) {
    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      console.log("Inside router post");
      res.status(200).json({ msg: "Expense added successfully" });
    }
  });

  // //ower list contains all the members of the group, including the payer
  // let owersList = await new Promise((resolve, reject) => {
  //   Group.find({ _id: group_id }, (err, result) => {
  //     if (err) {
  //       res.status(500).json({ msg: err });
  //     } else {
  //       if (result.length > 0) {
  //         let owers = [];
  //         for (i = 0; i < result[0].members.length; i++) {
  //           if (result[0].members[i].is_accepted) {
  //             owers.push(result[0].members[i].ID);
  //           }
  //         }
  //         resolve(owers);
  //       }
  //     }
  //   });
  // });
  // amount = req.body.amount / owersList.length;
  // amount_toGet = req.body.amount - amount;
  // console.log(amount_toGet);
  // var owers = [];
  // owersList.forEach((user) => {
  //   if (user != current_user) {
  //     const userData = {
  //       u_id: user,
  //       amount: amount,
  //       is_settled: 0,
  //     };
  //     owers.push(userData);
  //   }
  // });
  // //   console.log(owers);

  // const transactionDetails = new Transaction({
  //   g_id: group_id,
  //   payer_id: current_user,
  //   amount: req.body.amount,
  //   amountToGetBack: amount_toGet,
  //   currency: req.body.currency,
  //   description: req.body.description,
  //   ower: owers,
  // });
  // console.log(transactionDetails);
  // transactionDetails.save((err, result) => {
  //   if (err) {
  //     res.status(500).send(err);
  //   } else {
  //     res.status(200).json({ msg: "Expense added successfully" });
  //   }
  // });
});

router.post("/comment", checkAuth, (req, res) => {
  var current_user = req.header("user");
  var data = {
    current_user: current_user,
    t_id: req.body.t_id,
    comment: req.body.comment,
  };

  kafka.make_request("add_comment", data, function (err, results) {
    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      console.log("Inside router post");
      res.status(200).send(results);
    }
  });
  // Transaction.updateOne({
  //   _id: req.body.t_id
  // },
  // {
  //   $push :{ comments:[{u_id: current_user ,comment: req.body.comment }]}

  // },
  // (err, result) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.status(200).send(result);
  //   }
  // })
});

router.delete("/deleteComment/:c_id", checkAuth, async (req, res) => {
  var comment_id = req.params.c_id;
  
  kafka.make_request("delete_comment", comment_id, function (err, results) {
    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      console.log("Inside router post");
        res.status(200).send({ msg: "Comment Removed" });
}
  });
  
  // Transaction.findOneAndUpdate(
  //   { "comments._id": comment_id },
  //   { $pull: { comments: { _id: comment_id } } },
  //   { multi: true },
  //   (err, result) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.status(200).send({ msg: "Comment Removed" });
  //     }
  //   }
  // );
  // Transaction.findOneAndUpdate({comments._id: })
});
module.exports = router;
