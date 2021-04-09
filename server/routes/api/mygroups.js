const express = require("express");
const router = express.Router();

let Group = require("../../models/createGroupModel");

router.get("/invites", (req, res) => {
  var current_user = req.header("user");
  console.log(current_user);

  Group.find(
    {
      members: {
        $elemMatch: { ID: current_user, is_accepted: 0 },
      },
    },
    (err, result) => {
      if (err) {
        res.status(401).json({ msg: err });
      } else {
        console.log(result.length);
        let dbNotJoinedGroups = [];
        for (let i = 0; i < result.length; i++) {
          let notgroupobj = {
            g_id: result[i]._id,
            name: result[i].g_name,
          };
          dbNotJoinedGroups.push(notgroupobj);
        }
        console.log(dbNotJoinedGroups);
        res.status(200).send(dbNotJoinedGroups);
      }
    }
  );
});

router.put("/:id/accept", (req, res) => {
  console.log("hi");
  var current_user = req.header("user");
  var group_id = req.params.id;

  console.log(group_id);
  console.log(current_user);

  Group.updateOne(
    {
      _id: group_id,
      "members.ID": current_user,
    },
    {
      $set: { "members.$.is_accepted": true },
    },
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.status(200).send(result);
      }
    }
  );
});

router.get("/joined", (req, res) => {
  var current_user = req.header("user");
  console.log(current_user);

  Group.find(
    {
      members: {
        $elemMatch: { ID: current_user, is_accepted: 1 },
      },
    },
    (err, result) => {
      if (err) {
        res.status(401).json({ msg: err });
      } else {
        console.log(result.length);
        let dbNotJoinedGroups = [];
        for (let i = 0; i < result.length; i++) {
          let notgroupobj = {
            g_id: result[i]._id,
            name: result[i].g_name,
          };
          dbNotJoinedGroups.push(notgroupobj);
        }
        console.log(dbNotJoinedGroups);
        res.status(200).send(dbNotJoinedGroups);
      }
    }
  );
});

router.post("/getGroups", (req, res) => {
  var current_user = req.header("user");
 
  Group.find(
    {
      members: {
        $elemMatch: { ID: current_user, is_accepted: 1 },
      },
      g_name: new RegExp(req.body.g_name, "i"),
    },
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        let dbgroupnames = [];
        for (let i = 0; i < result.length; i++) {
          let groupobj = {
            g_id: result[i]._id,
            name: result[i].g_name,
          };
          dbgroupnames.push(groupobj);
        }
        res.status(200).send(dbgroupnames);      }
    }
  );
});

module.exports = router;

