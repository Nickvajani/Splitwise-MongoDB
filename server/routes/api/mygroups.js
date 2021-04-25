const express = require("express");
const router = express.Router();
const {checkAuth} = require("../../config/passport")
var kafka = require('../../kafka/client');




router.get("/invites", checkAuth , (req, res) => {
  var current_user = req.header("user");
  console.log(current_user);

  kafka.make_request('get_invites',current_user, function(err,results){
    if(err){
      console.log("Inside err");
      res.json({
          status:"error",
          msg:"System Error, Try Again."
      })
    }else{
      console.log("Inside router post");
      res.send(results);

    }
  })

  // Group.find(
  //   {
  //     members: {
  //       $elemMatch: { ID: current_user, is_accepted: 0 },
  //     },
  //   },
  //   (err, result) => {
  //     if (err) {
  //       res.status(401).json({ msg: err });
  //     } else {
  //       let dbNotJoinedGroups = [];
  //       for (let i = 0; i < result.length; i++) {
  //         let notgroupobj = {
  //           g_id: result[i]._id,
  //           name: result[i].g_name,
  //         };
  //         dbNotJoinedGroups.push(notgroupobj);
  //       }
  //       // console.log(dbNotJoinedGroups);
  //       res.status(200).send(dbNotJoinedGroups);
  //     }
  //   }
  // );
});

router.put("/:id/accept", checkAuth , (req, res) => {
  console.log("from accept");
  var current_user = req.header("user");
  var group_id = req.params.id;

  console.log(group_id);
  console.log(current_user);
  let data = {
    group_id: group_id,
    current_user: current_user
  }
  kafka.make_request('join_group',data, function(err,results){
    if(err){
      console.log("Inside err");
      res.json({
          status:"error",
          msg:"System Error, Try Again."
      })
    }else{
      console.log("Inside router post");
      res.send(results);

    }
  })



  // Group.updateOne(
  //   {
  //     _id: group_id,
  //     "members.ID": current_user,
  //   },
  //   {
  //     $set: { "members.$.is_accepted": true },
  //   },
  //   (err, result) => {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.status(200).send(result);
  //     }
  //   }
  // );
});

router.get("/joined", checkAuth , (req, res) => {
  var current_user = req.header("user");

  kafka.make_request('get_joined',current_user, function(err,results){
    if(err){
      console.log("Inside err");
      res.json({
          status:"error",
          msg:"System Error, Try Again."
      })
    }else{
      console.log("Inside router post");
      res.send(results);

    }
  })


  // Group.find(
  //   {
  //     members: {
  //       $elemMatch: { ID: current_user, is_accepted: 1 },
  //     },
  //   },
  //   (err, result) => {
  //     if (err) {
  //       res.status(401).json({ msg: err });
  //     } else {
  //       let dbNotJoinedGroups = [];
  //       for (let i = 0; i < result.length; i++) {
  //         let notgroupobj = {
  //           g_id: result[i]._id,
  //           name: result[i].g_name,
  //         };
  //         dbNotJoinedGroups.push(notgroupobj);
  //       }
  //       // console.log(dbNotJoinedGroups);
  //       res.status(200).send(dbNotJoinedGroups);
  //     }
  //   }
  // );
});

router.post("/getGroups", checkAuth , (req, res) => {
  var current_user = req.header("user");
 let data ={
   current_user :current_user,
   name: req.body.g_name
 }
  kafka.make_request('get_groups',data, function(err,results){
    if(err){
      console.log("Inside err");
      res.json({
          status:"error",
          msg:"System Error, Try Again."
      })
    }else{
      console.log("Inside router post");
      res.send(results);

    }
  })


  // Group.find(
  //   {
  //     members: {
  //       $elemMatch: { ID: current_user, is_accepted: 1 },
  //     },
  //     g_name: new RegExp(req.body.g_name, "i"),
  //   },
  //   (err, result) => {
  //     if (err) {
  //       res.send(err);
  //     } else {
  //       let dbgroupnames = [];
  //       for (let i = 0; i < result.length; i++) {
  //         let groupobj = {
  //           g_id: result[i]._id,
  //           name: result[i].g_name,
  //         };
  //         dbgroupnames.push(groupobj);
  //       }
  //       res.status(200).send(dbgroupnames);      }
  //   }
  // );
});

router.delete("/leave/:g_id", checkAuth , async (req,res) => {
  var current_user = req.header("user");
  let data ={
    current_user :current_user,
    g_id: req.params.g_id
  }
  kafka.make_request('leave_group',data, function(err,results){
    if(err){
      console.log("Inside err");
      res.json({
          status:"error",
          msg:"System Error, Try Again."
      })
    }else{
      console.log("Inside router post");
      res.send(results);

    }
  })





  // Transaction.find({"ower.u_id" : current_user,"ower.is_settled":false , g_id: req.params.g_id} ,async(err,result) =>{
  //   if(err){
  //     console.log(err)
  //   }else{
  //     if(result.length!==0){
  //       console.log("Due left")
  //       res.status(400).send({ msg: "Please Settle your pending balance in the group" });
  //     }else{

  //       const left = await leaveGroup(req.params.g_id, current_user);
  //       console.log(left);
  //       res.status(200).send({ msg: left });      }
  //   }
  // })
})


// const leaveGroup = async (g_id, current_user) => {
//   Group.findOneAndUpdate({_id:g_id },{$pull:{members:{ID:current_user}}},{multi:true} ,(err,result) => {
//     if (result) {
//       console.log(result)
//       return { msg: "You left the group successfully" };
//     }else{
//       console.log(err)
//     }
//   })
  
// };

module.exports = router;

