const express = require("express");
const router = express.Router();
const {checkAuth} = require("../../config/passport")
var kafka = require('../../kafka/client');


router.get("/getGroupsId", checkAuth ,(req, res) => {
  var current_user = req.header("user");

  kafka.make_request("get_ids", current_user, function (err, results) {
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


  // Group.find(
  //   { "members.ID": current_user, "members.is_accepted": true },
  //   (err, result) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       groups = [];
  //       for (i = 0; i < result.length; i++) {
  //         groups[i] = result[i]._id;
  //       }
  //       res.status(200).send(groups);
  //     }
  //   }
  // );
});

router.get("/getGroupNames", checkAuth , (req, res) => {
  var group_id = req.query.g_id;

  kafka.make_request("get_names", group_id, function (err, results) {
    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      console.log("Inside router post");
      console.log(results)
      res.status(200).send(results);
    }
  });
  
  // Group.find({ _id: group_id }, (err, result) => {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     //   console.log(result[0].g_name)
  //     res.status(200).send(result[0].g_name);
  //   }
  // });
});

router.get("/getTotalOwe", checkAuth , (req, res) => {
  var current_user = req.header("user");

  kafka.make_request("get_owe", current_user, function (err, results) {
    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      console.log("Inside router post");
      console.log(results)
      res.status(200).send(results);
    }
  });

  // Transaction.find({ "ower.u_id": current_user, "ower.is_settled": false })
  //   .populate({ path: "ower.u_id" })
  //   .then((result) => {
  //     // console.log(result);
  //     let owerAmountDetails = {
  //       owedAmount: 0,
  //     };
  //     for (i = 0; i < result.length; i++) {
  //       for (j = 0; j < result[i].ower.length; j++) {
  //         if (String(result[i].ower[j].u_id._id) === String(current_user) &&  result[i].ower[j].is_settled == false) {
  //           owerAmountDetails.owedAmount += result[i].ower[j].amount;
  //         }
  //       }
  //     }
  //     res.status(200).send(owerAmountDetails);
  //   });
});

router.get("/getTotalGet", checkAuth ,(req, res) => {
  var current_user = req.header("user");

  kafka.make_request("get_totalGet", current_user, function (err, results) {
    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      console.log("Inside router post");
      console.log(results)
      res.status(200).send(results);
    }
  });

  // Transaction.find({ payer_id: current_user })
  //   .populate({ path: "ower.u_id" })
  //   .then((result) => {
  //     // console.log(result)
  //     let payerAmountDetails = {
  //       GetBackAmount: 0,
  //     };
  //     for (i = 0; i < result.length; i++) {
  //       for (j = 0; j < result[i].ower.length; j++) {
  //         if (result[i].ower[j].is_settled == false) {
  //           // console.log(result[i].description)
  //           // console.log(result[i].ower[j].u_id.name)
  //           // console.log(result[i].ower[j].amount)

  //           payerAmountDetails.GetBackAmount += result[i].ower[j].amount;
  //         }
  //       }
  //     }
  //     res.status(200).send(payerAmountDetails);
  //   });
});

router.post("/getPerson", checkAuth , (req, res) => {
  var current_user = req.header("user");

  let data = {
    current_user: current_user,
    g_id: req.body.g_id
  }
  kafka.make_request("get_person", data, function (err, results) {
    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      console.log("Inside router post");
      console.log(results)
      res.status(200).send(results);
    }
  });

  // Transaction.find({
  //   "ower.u_id": current_user,
  //   "ower.is_settled": false,
  //   g_id: req.body.g_id
  //   // "payer_id.$.name": new RegExp(req.body.name, "i"),
  // })
  //   .populate({ path: "payer_id" })
  //   .then((result) => {
  //     // console.log(result);
  //     let dbPersonNames = [];
  //     for (let i = 0; i < result.length; i++) {
  //       let personNamesObj = {
  //         payer_id: result[i].payer_id._id,
  //         name: result[i].payer_id.name,
  //       };
  //       dbPersonNames.push(personNamesObj);
  //     }
  //     // console.log(dbPersonNames);
  //     const uniqueArray = dbPersonNames.filter((thing, index) => {
  //       const _thing = JSON.stringify(thing);
  //       return (
  //         index ===
  //         dbPersonNames.findIndex((obj) => {
  //           return JSON.stringify(obj) === _thing;
  //         })
  //       );
  //     });
  //     res.status(200).send(uniqueArray);
  //   });
});

router.post("/settle", checkAuth , async (req, res) => {
  var current_user = req.header("user");
  // console.log("in settle")
  let data ={
    payer_id: req.body.payer_id,
    g_id: req.body.g_id,
    current_user: current_user
  }

  kafka.make_request("post_settle", data, function (err, results) {
    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      console.log("Inside router post");
      console.log(results)
      res.status(200).send(results);
    }
  });

//   let TransactionId = await new Promise((resolve, reject) => {
//     Transaction.find({ payer_id: req.body.payer_id, g_id: req.body.g_id }, (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         let id = [];
//         for (i = 0; i < result.length; i++) {
//           id.push(result[i]._id);
//         }
//         // console.log(id)
//         resolve(id);
//       }
//     });
//   });
//   console.log(TransactionId);
  
//   for (i = 0; i < TransactionId.length; i++) {
//     Transaction.updateOne(
//       { _id: TransactionId[i], "ower.u_id": current_user },
//       {
//         $set: {
//           "ower.$.is_settled": true,
//         },
//       },
//       (err, result) => {
//         if (err) {
//           console.log(err);
//         } else {
//             console.log(result)
//         }
//       }
//     );
//   }

//   let TransactionIdForCurrentUser = await new Promise((resolve, reject) => {
//     Transaction.find({ payer_id: current_user, g_id: req.body.g_id }, (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         let id = [];
//         for (i = 0; i < result.length; i++) {
//           id.push(result[i]._id);
//         }
//         // console.log(id)
//         resolve(id);
//       }
//     });
// });
// console.log(TransactionIdForCurrentUser)

// for (i = 0; i < TransactionIdForCurrentUser.length; i++) {
//         Transaction.updateOne(
//           { _id: TransactionIdForCurrentUser[i], "ower.u_id": req.body.payer_id },
//           {
//             $set: {
//               "ower.$.is_settled": true,
//             },
//           },
//           (err, result) => {
//             if (err) {
//               console.log(err);
//             } else {
//               console.log(result);
//             }
//           }
//         );
//       }
//       res.status(200).json({ msg: "Settled!!!" });
});

module.exports = router;
