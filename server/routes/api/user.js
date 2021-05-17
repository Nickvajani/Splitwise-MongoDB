const express = require("express");
const router = express.Router();
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret } = require("../../config/keys");
const { auth } = require("../../config/passport");
auth();
var kafka = require("../../kafka/client");

let User = require("../../models/userModel");

// @route Get user
// @desc get user details for login
router.post("/login", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).json({ msg: "All fields required" });
  } else {
    kafka.make_request("login", req.body, function (err, results) {
      if (err) {
        console.log("Inside err");
        res.json({
          status: "error",
          msg: "System Error, Try Again.",
        });
      } else {
        console.log("Inside router post");
        console.log(results);
        res.status(200).send(results);
      }
    });

    // console.log(req.body.email)
    //   User.find({
    //     email: req.body.email,
    //   }, (err, result) => {
    //       if(err){
    //           res.status(400).json({msg: err})
    //       }else{
    //           if(result){
    //               if(bcrypt.compareSync(req.body.password, result[0].password)){
    //                 const payload = { id: result[0]._id, username: result[0].name, email: result[0].email}
    //                 const token = jwt.sign(payload,secret)
    //                 res.status(200).end("JWT " + token);

    //                 // res.send(result)
    //               }else{
    //                 res.status(401).json({msg: "Wrong Password"})
    //               }
    //           }else{
    //             res.status(400).json({msg: "User doesn't exist"})
    //           }
    //       }
    //   })
    //     // .then((user) => res.json(user))
    //     .catch((err) => res.status(400).json("Error: " + err));
  }
});

router.post("/signup", async (req, res) => {
  if (
    req.body.name.length == 0 ||
    req.body.email.length == 0 ||
    req.body.password.length == 0
  ) {
    res.status(400).json({ msg: "All fields required" });
  } else {
    kafka.make_request("signup", req.body, function (err, results) {
      if (err) {
        console.log("Inside err");
        res.json({
          status: "error",
          msg: "System Error, Try Again.",
        });
      } else {
        console.log("Inside router post");
        console.log(results);
        res.status(200).send(results);
      }
    });

    // let name = req.body.name;
    // let email = req.body.email;
    // let password = await bcrypt.hash(req.body.password, 10);

    // const newUser = new User({
    //   name,
    //   email,
    //   password,
    // });
    // User.findOne({ email: req.body.email }, (err, result) => {
    //   if (err) {
    //     res.end();
    //   }
    //   if (result) {
    //     res.status(500).json({ msg: "User already exists" });
    //   } else {
    //     newUser.save((err, result) => {
    //       if (err) {
    //         res.status(500).send();
    //       } else {
    //         const payload = {
    //           id: result._id,
    //           username: req.body.name,
    //           email: req.body.email,
    //         };
    //         const token = jwt.sign(payload, secret);
    //         res.status(200).end("JWT " + token);
    //       }
    //     });
    //   }
    // });
    // newUser
    //   .save()
    //   .then((user) => res.json({id: user._id}))
    //   .catch((err) => res.status(400).json("Error: " + err));
  }
});

module.exports = router;
