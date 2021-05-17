const express = require("express");
const router = express.Router();
const { checkAuth } = require("../../config/passport");
var kafka = require("../../kafka/client");

router.put("/update", checkAuth, (req, res) => {
  kafka.make_request("update_profile", req.body, function (err, results) {
    if (err) {
      console.log("Inside err");
      res.json({
        status: "error",
        msg: "System Error, Try Again.",
      });
    } else {
      console.log(results);
      if (results === "Error") {
        res.status(404).send();
      } else {
        console.log("Inside router post");
        res.status(200).send(results);
      }
    }
  });

  //   User.findByIdAndUpdate(
  //   req.body.id,
  //   {
  //     $set: {
  //       phoneNumber: req.body.phoneNumber,
  //       defaultCurrency: req.body.defaultCurrency,
  //       timeZone: req.body.timezone,
  //       language: req.body.language,
  //       email: req.body.email,
  //       name: req.body.username,
  //     },
  //   }, (err,result) => {
  //       if(err){
  //           res.status(401).json({msg: "Error"})
  //       }
  //       else{
  //           res.send(result);
  //       }
  //   }
  // );
});

router.post("/get", checkAuth, (req, res) => {
  kafka.make_request("get_profile", req.body, function (err, results) {
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

  // User.find({email:req.body.email},(err,result) => {
  //     if(err){
  //         console.log("err " +err)
  //         res.status(401).json({msg: "Error"})
  //     }
  //     else{
  //         res.send(result);
  //     }
  // })
});

module.exports = router;
