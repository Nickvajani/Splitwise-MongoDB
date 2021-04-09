const express = require("express");
const router = express.Router();

let User = require("../../models/userModel");

router.put("/update", (req, res) => {
   console.log("update")
    console.log(req.body)
    User.findByIdAndUpdate(
    req.body.id,
    {
      $set: {
        phoneNumber: req.body.phoneNumber,
        defaultCurrency: req.body.defaultCurrency,
        timeZone: req.body.timezone,
        language: req.body.language,
        email: req.body.email,
        name: req.body.username,
      },
    }, (err,result) => {
        if(err){
            console.log("err " +err)
            // res.status(401).json({msg: "Error"})
        }
        else{
            res.send(result);
        }
    }
  );
});

router.post("/get", (req, res) => {
  console.log(req.body)
    User.find({email:req.body.email},(err,result) => {
        if(err){
            console.log("err " +err)
        }
        else{
            console.log("res" +result)
            res.send(result);
        }
    })
   });
   
module.exports = router;

