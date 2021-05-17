const express = require("express");
const router = express.Router();
const { checkAuth } = require("../../config/passport");
var kafka = require("../../kafka/client");

router.post("/getName", checkAuth, (req, res) => {
  let name = req.body.name;

  kafka.make_request("get_Name", name, function (err, results) {
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

  // User.find({ name: new RegExp(name, "i") }, (err, result) => {
  //   if (err) {
  //     res.send(err);
  //   } else {
  //     let usernames = [];
  //     for (i = 0; i < result.length; i++) {
  //       let obj = {
  //         id: result[i]._id,
  //         name: result[i].name,
  //       };
  //       usernames.push(obj);
  //     }
  //     res.status(200).send(usernames);
  //   }
  // });
});

router.post("/getEmail", checkAuth, (req, res) => {
  let email = req.body.email;
  console.log(email);

  kafka.make_request("get_email", email, function (err, results) {
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

  // User.find({ email: new RegExp(email, "i") }, (err, result) => {
  //   if (err) {
  //     res.send(err);
  //   } else {
  //     //   console.log(result)
  //     let userEmails = [];
  //     for (i = 0; i < result.length; i++) {
  //       let obj = {
  //         id: result[i]._id,
  //         email: result[i].email,
  //         name: result[i].name,
  //       };
  //       userEmails.push(obj);
  //     }
  //     res.status(200).send(userEmails);
  //   }
  // });
});

router.post("/", checkAuth, (req, res) => {
  let group_admin = req.header("user");
  var data = {
    group_admin: group_admin,
    users: req.body.users,
    g_name: req.body.g_name,
  };

  kafka.make_request("create_group", data, function (err, results) {
    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      console.log(results);
      if (results === "Group Already Exists") {
        res.status(404).json({ msg: "Group Exists" });
      } else {
        console.log("Inside router post");
        res.status(200).json({ msg: "Group Created successfully" });
      }
    }
  });

  // var members = [];
  // req.body.users.forEach((user) => {
  //   const userData = {
  //     ID: user,
  //     is_accepted: user == group_admin ? 1 : 0,
  //   };
  //   members.push(userData);
  // });
  // // console.log(members);

  // const newGroup = new Group({
  //   g_name: req.body.g_name,
  //   members: members,
  // });
  //  console.log(newGroup)
  // Group.findOne({ g_name: req.body.g_name }, (err, result) => {
  //   if (err) {
  //     res.end();
  //   }
  //   if (result) {
  //     console.log("group Found with same name")
  //     res.status(400).json({ msg: "group already exists" });
  //   } else {
  //     newGroup.save((err, result) => {
  //       if (err) {
  //         console.log("cannot create group")
  //         res.status(500).send(err);
  //       } else {
  //         console.log("group Created")
  //         res.status(200).json({ msg: "Group Created successfully" });
  //       }
  //     });
  //   }
  // });
});

module.exports = router;
