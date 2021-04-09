const express = require("express");
const router = express.Router();

let User = require("../../models/userModel");
let Group = require("../../models/createGroupModel");
let Transaction = require("../../models/transactionModel");
const { resolve } = require("path");

router.get("/userDetails", (req, res) => {
  var current_user = req.header("user");
  User.find({ _id: current_user }, (err, result) => {
    if (err) {
      res.status(500).json({ msg: err });
    } else {
      let curr = {
        default_currency: result[0].defaultCurrency,
      };
      res.status(200).send(curr);
    }
  });
});

router.get("/groupDetails", (req, res) => {
  var group_id = req.query.g_id;
  Group.find({ _id: group_id }, (err, result) => {
    if (err) {
      res.status(500).json({ msg: err });
    } else {
      console.log(result[0].g_name);
      res.status(200).send(result[0].g_name);
    }
  });
});

router.get("/expenses", (req, res) => {
  var group_id = req.query.g_id;
  Transaction.find({ g_id: group_id })
    .populate({ path: "g_id" })
    .populate({ path: "payer_id" })
    .sort({ createdAt: -1 })
    .then((user) => {
      let group_details = [];
      for (let i = 0; i < user.length; i++) {
        let obj = {
          amount: user[i].amount,
          payer_name: user[i].payer_id.name,
          description: user[i].description,
          created_at: user[i].createdAt,
        };
        group_details.push(obj);
      }
      res.send(group_details);
    });
});

router.get("/owe", async (req, res) => {
  console.log("owe called");
  var group_id = req.query.g_id;
  try {
    let memberList = await new Promise((resolve, reject) => {
      Group.find({ _id: group_id }, (err, result) => {
        if (err) {
          res.status(500).json({ msg: err });
        } else {
          let members = [];
          for (i = 0; i < result[0].members.length; i++) {
            if (result[0].members[i].is_accepted) {
              members[i] = result[0].members[i].ID;
              // owers.push(result[0].members[i].ID);
            }
          }
          resolve(members);
        }
      });
    });
    let totalAmounts = []; //contains each member ower amount
    for (z = 0; z < memberList.length; z++) {
      let owersObj = await new Promise((resolve, reject) => {
        Transaction.find({
          g_id: group_id,
          "ower.u_id": memberList[z],
          "ower.is_settled": false,
        })
          .populate({ path: "g_id" })
          .populate({ path: "payer_id" })
          .populate({ path: "ower.u_id" })
          .then((user) => {
            if (user.length > 0) {
              let amounts = {};
              amounts["amount_owed"] = 0.0;
              // amounts["group_name"] = user[0].g_id.g_name
              for (let i = 0; i < user.length; i++) {
                for (let j = 0; j < user[i].ower.length; j++) {
                  if (
                    String(user[i].ower[j].u_id._id) === String(memberList[z])
                  ) {
                    amounts["name"] = user[i].ower[j].u_id.name;
                    amounts["ower_id"] = user[i].ower[j].u_id._id;
                    amounts["amount_owed"] += user[i].ower[j].amount;
                    amounts["group_name"] = user[0].g_id.g_name;
                  }
                }
              }
              resolve(amounts);
            } else {
              resolve(null);
            }
          });
      });
      if (owersObj != null) {
        totalAmounts.push(owersObj);
      }
    }

    let payerAmount = [];
    for (z = 0; z < memberList.length; z++) {
      let payersObj = await new Promise((resolve, reject) => {
        Transaction.find({ g_id: group_id, payer_id: memberList[z] })
          .populate({ path: "g_id" })
          .populate({ path: "payer_id" })
          .populate({ path: "ower.u_id" })
          .then((user) => {
            if (user.length > 0) {
              let amounts = {};
              amounts["amount_toGetBack"] = 0.0;
            //   amounts["sumOfOwers"] = 0.0;
              // console.log(user[0])
              for (let i = 0; i < user.length; i++) {
                if (String(user[i].payer_id._id) === String(memberList[z])) {
                  
                    for (j = 0; j < user[i].ower.length; j++) {
                        if(user[i].ower[j].is_settled == false){
                            amounts["amount_toGetBack"] += user[i].ower[j].amount
                        }
                  }
                //   console.log(amounts)
                //   console.log(user[i].amount)
                  amounts["name"] = user[i].payer_id.name;
                  amounts["payer_id"] = user[i].payer_id._id;
                //   amounts["amount_toGetBack"] = user[i].amount - amounts["sumOfOwers"];
                  amounts["group_name"] = user[0].g_id.g_name;
                }
              }
              resolve(amounts);
            } else {
              resolve(null);
            }
          });
      });
      if (payersObj != null) {
        payerAmount.push(payersObj);
      }
    }    
    if (payerAmount != null && totalAmounts != null) {
      for (i = 0; i < totalAmounts.length; i++) {
        for (j = 0; j < payerAmount.length; j++) {
          if (payerAmount[j].name == totalAmounts[i].name) {
            totalAmounts[i].amount_owed -= payerAmount[j].amount_toGetBack;
          }
        }
      }
    }
    console.log(totalAmounts);
    res.status(200).send(totalAmounts);
  } catch (error) {
    res.status(400).json({ msg: err });
  }
});
router.post("/addExpense/:g_id", async (req, res) => {
  console.log("adding");
  var current_user = req.header("user");
  var group_id = req.params.g_id;

  //ower list contains all the members of the group, including the payer
  let owersList = await new Promise((resolve, reject) => {
    Group.find({ _id: group_id }, (err, result) => {
      if (err) {
        res.status(500).json({ msg: err });
      } else {
        if(result.length>0){
          let owers = [];
          for (i = 0; i < result[0].members.length; i++) {
            if (result[0].members[i].is_accepted) {
              owers.push(result[0].members[i].ID);
            }
          }
          resolve(owers);
        }
      }
    });
  });
  amount = req.body.amount / owersList.length;
  amount_toGet = req.body.amount - amount;
  console.log(amount_toGet);
  var owers = [];
  owersList.forEach((user) => {
    if (user != current_user) {
      const userData = {
        u_id: user,
        amount: amount,
        is_settled: 0,
      };
      owers.push(userData);
    }
  });
  //   console.log(owers);

  const transactionDetails = new Transaction({
    g_id: group_id,
    payer_id: current_user,
    amount: req.body.amount,
    amountToGetBack: amount_toGet,
    currency: req.body.currency,
    description: req.body.description,
    ower: owers,
  });
  console.log(transactionDetails);
  transactionDetails.save((err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).json({ msg: "Expense added successfully" });
    }
  });
});

module.exports = router;
