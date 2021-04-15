const express = require("express");
const router = express.Router();
var AWS = require('aws-sdk')
const { v4: uuidv4 } = require('uuid');

const BUCKET = 'splitwise-mongo'
const REGION = 'us-east-1'
const ACCESS_KEY = 'AKIAUJCF4DDSRSKOTG2G'
const SECRET_KEY = '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'


let User = require("../../models/userModel");


router.post('/' , (req,res) =>{
    var current_user = req.header("user");
    if (req.files === null) {
      return res.status(400).json({ msg: "No file was uploaded" });
    }
    
    const file = req.files.file;
    let str = file.name
    
    let ext = str.split('.')[1]
    
    AWS.config.update({
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
      region: REGION
    })
    let uuid=uuidv4()
    var s3 = new AWS.S3()
    
    s3.putObject({
      Bucket: BUCKET,
      Body: file.data,
      Key: uuid+'.'+ext
    })
      .promise()
      .then(response => {
        // console.log(`done! - `, response)
        console.log(
          `The URL is ${s3.getSignedUrl('getObject', { Bucket: BUCKET, Key: uuid+'.'+ext })}`
        )

        User.updateOne({
            _id: current_user
        },{
            $set:{
                profilePicture: s3.getSignedUrl('getObject', { Bucket: BUCKET, Key: uuid+'.'+ext }) 
            }
        },(err,result)=>{
            if(err){
                console.log(err)
            }else{
                console.log(result)
                res.status(200).send(s3.getSignedUrl('getObject', { Bucket: BUCKET, Key: uuid+'.'+ext }))
            }
        })

      })
      .catch(err => {
        return res.status(500).send(err);
      })

})

module.exports = router;
