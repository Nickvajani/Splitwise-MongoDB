const express = require("express");
var bodyParser = require("body-parser");
const mysql = require("mysql");
const db = require("./utils/dbConnection");
const app = express();
const db = require("./utils/dbConnection");
var cors = require("cors");
var bcrypt = require("bcryptjs");
const moment = require("moment");
const { json } = require("body-parser");
const fileUpload = require("express-fileupload");

// const generator = require('uuid-int')(0,29)

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// app.use(function (req, res, next) {
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "http://ec2-54-234-132-167.compute-1.amazonaws.com"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET,HEAD,OPTIONS,POST,PUT,DELETE"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
//   );
//   res.setHeader("Cache-Control", "no-cache");
//   next();
// });
app.use(fileUpload());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

DB = db.connectDB();
app.post("/upload", (req, res) => {
  // console.log("hi");
  if (req.files === null) {
    return res.status(400).json({ msg: "No file was uploaded" });
  }

  const file = req.files.file;
 // console.log(req.files.file);
  file.mv(`${__dirname}/../client/public/uploads/${file.name}`, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
  });
});

//Check for number of groups of current user(dashboard)
app.get("/dashboard/getGroupsId", (req, res) => {
  var current_user = parseInt(req.header("user"));
  DB.query(
    `Select * from members where u_id=? and isaccepted=?`,
    [current_user, 1],
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        groupMembers = [];
        for (i = 0; i < result.length; i++) {
          groupMembers[i] = result[i].g_id;
        }
        res.status(200).send(groupMembers);
      }
    }
  );
});
//get userTotalOwe(dashboard)
app.get("/dashboard/getTotalOwe", (req, res) => {
  var current_user = parseInt(req.header("user"));
  DB.query(
    `select * from ower where ower_id =? and is_settled= ?`,
    [current_user, 0],
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        // console.log(result)
        let r = {
          owedAmount: 0,
        };
        for (i = 0; i < result.length; i++) {
          r.owedAmount += result[i].amount_owed;
        }
        // console.log("now sending")
        // console.log(owedAmount)
        res.status(200).send(r);
      }
    }
  );
});
app.get("/dashboard/getTotalGet", (req, res) => {
  var current_user = parseInt(req.header("user"));
  DB.query(
    `select * from ower 
  inner join transaction on transaction.t_id = ower.t_id
  where payer_id =? and is_settled=? group by transaction.t_id`,
    [current_user, 0],
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        // console.log(result)
        let r = {
          getAmount: 0,
        };
        for (i = 0; i < result.length; i++) {
          r.getAmount += result[i].amount - result[i].amount_owed;
        }
        // console.log("now sending")
        // console.log(getAmount)
        res.status(200).send(r);
      }
    }
  );
});
//get groupnames for dashboard
app.get("/dashboard/getGroupNames", (req, res) => {
  var group_id = parseInt(req.query.g_id);
  DB.query(
    `SELECT * FROM splitwiseTest.group where g_id=?`,
    [group_id],
    (err, result) => {
      if (err) {
        //console.log(err);
        res.status(401).json({ msg: "Not found" });
      } else {
        res.status(200).send(result[0].g_name);
      }
    }
  );
});

const everyTransactionDetails = async (myGroupNo, current_user) => {
  let promiseResult = await new Promise((resolve, reject) => {
    DB.query(
      `select * from transaction
            inner join user on user.u_id=transaction.payer_id
            inner join splitwiseTest.group on splitwiseTest.group.g_id=transaction.g_id
            inner join ower on ower.t_id= transaction.t_id
            where transaction.g_id=? group by transaction.t_id order by t_created_at desc`,
      [myGroupNo],
      (err, result) => {
        let groupsTransactionDetails = [];

        if (err) {
          reject(err);
        } else {
          for (i = 0; i < result.length; i++) {
            if (result[i].payer_id == current_user) {
              let getBackAmount = 0;
              getBackAmount = -(result[i].amount - result[i].amount_owed);
              let eachTransaction = {
                amount: getBackAmount,
                payerName: result[i].name,
                description: result[i].description,
                groupName: result[i].g_name,
                created_at: result[i].created_at,
                updated_at: result[i].updated_at,
              };
              groupsTransactionDetails.push(eachTransaction);
            } else {
              let eachTransaction = {
                amount: result[i].amount_owed,
                payerName: result[i].name,
                description: result[i].description,
                groupName: result[i].g_name,
                created_at: result[i].created_at,
                updated_at: result[i].updated_at,
              };
              groupsTransactionDetails.push(eachTransaction);
            }
          }
        }
       // console.log(groupsTransactionDetails);
        resolve(groupsTransactionDetails);
      }
    );
  });
  return promiseResult;
};

app.delete("/mygroup/leave/:g_id", async (req, res) => {
  // console.log(req.body)
  var current_user = parseInt(req.header("user"));


  DB.query(
    `select * from ower
  inner join transaction on transaction.t_id = ower.t_id
  where ower_id=? and g_id=? and is_settled=?`,
    [current_user, req.params.g_id, 0],
    async (err, result) => {
     
      if (result.length != 0) {
        // console.log("not");
        // console.log(result);
        res
          .status(204)
          .send({ msg: "Please Settle your pending balance in the group" });
      } else {
        
        // const noDue = await checkNoduePayer(current_user, req.params.g_id)
        // console.log(noDue)
        const left = await leaveGroup(req.params.g_id, current_user);
        console.log(left);
        res.status(200).send({ msg: left });
      }
    }
  );
});
// const checkNoduePayer = async (current_user, g_id) => {
//   // console.log("in no due");
//   let res2 = await new Promise((resolve, reject) => {
//     let totalAmounts = [];
//     DB.query(
//       `select * from ower 
//   inner join transaction on transaction.t_id = ower.t_id
//   inner join user on user.u_id=ower.ower_id
//   inner join splitwiseTest.group on splitwiseTest.group.g_id = transaction.g_id
//   where ower_id = ? and transaction.g_id = ? and is_settled=?`,
//       [current_user, g_id, 0],
//       (err, result) => {
//         if (err) {
//           console.log(err);
//         } else {
//           if (result.length > 0) {
//             let amounts = {};
//             amounts["amount_owed"] = 0;
//             for (let i = 0; i < result.length; i++) {
//               amounts["name"] = result[i].name;
//               amounts["ower_id"] = result[i].ower_id;
//               amounts["amount_owed"] += result[i].amount_owed;
//               amounts["group_name"] = result[i].g_name;
//             }
//             if (Object.keys(amounts).length != 0) {
//               totalAmounts.push(amounts);
//             }
//           } else {
//             let amounts = {};
//             amounts["amount_owed"] = 0;
//             amounts["name"] = "";
//             amounts["ower_id"] = current_user;
//           }
//         }
//       }
//     );
//     const uniqueArray = totalAmounts.filter((thing, index) => {
//       const _thing = JSON.stringify(thing);
//       return (
//         index ===
//         totalAmounts.findIndex((obj) => {
//           return JSON.stringify(obj) === _thing;
//         })
//       );
//     });
//     resolve(uniqueArray);
//   });
//   console.log(res2);
//   return res2;
// };

const leaveGroup = async (g_id, current_user) => {

  await DB.query(
    `delete from splitwiseTest.members where u_id=? and g_id=?`,
    [current_user, g_id],
    (err, result) => {
      if (result) {
       
        return { msg: "You left the group successfully" };
      }
    }
  );
};

//Recent activity
app.get("/recentActivity", async (req, res) => {
  // var group_id = parseInt(req.query.g_id);
  var group_id = parseInt(req.params.g_id);
  var current_user = parseInt(req.header("user"));

  try {
    let myGroups = await new Promise((resolve, reject) => {
      DB.query(
        `Select * from members where u_id=? and isaccepted=?`,
        [current_user, 1],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            groupMembers = [];
            for (i = 0; i < result.length; i++) {
              groupMembers[i] = result[i].g_id;
            }
            resolve(groupMembers);
          }
        }
      );
    });
   
    let outerTransactions = [];
    await Promise.all(
      myGroups.map(async (group) => {
        const contents = await everyTransactionDetails(group, current_user);
        outerTransactions = [...outerTransactions, ...contents];
      })
    );
    outerTransactions.sort(function (a, b) {
      return new Date(a.created_at) - new Date(b.created_at);
    });
    // console.log(outerTransactions);
    res.send(outerTransactions);
  } catch (err) {}
});

//New display how much he owes in a group
app.get("/owe", async (req, res) => {
  var group_id = parseInt(req.query.g_id);
  try {
    let res1 = await new Promise((resolve, reject) => {
      DB.query(
        `select * from members where g_id=? and isaccepted=?`,
        [group_id, 1],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            groupMembers = [];
            for (i = 0; i < result.length; i++) {
              groupMembers[i] = result[i].u_id;
            }
            resolve(groupMembers);
          }
        }
      );
    });
    // console.log(res1)
    //for ower
    let res2 = await new Promise(async (resolve, reject) => {
      let totalAmounts = [];
      for (i = 0; i < res1.length; i++) {
        let records = await new Promise((resolve, reject) => {
          DB.query(
            `select * from ower 
          inner join transaction on transaction.t_id = ower.t_id
          inner join user on user.u_id=ower.ower_id
          inner join splitwiseTest.group on splitwiseTest.group.g_id = transaction.g_id
          where ower_id = ? and transaction.g_id = ? and is_settled=?`,
            [res1[i], group_id, 0],
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                if (result.length > 0) {
                  let amounts = {};
                  amounts["amount_owed"] = 0.0;
                  for (let i = 0; i < result.length; i++) {
                    amounts["name"] = result[i].name;
                    amounts["ower_id"] = result[i].ower_id;
                    amounts["amount_owed"] += result[i].amount_owed;
                    amounts["group_name"] = result[i].g_name;
                  }
                  resolve(amounts);
                } else {
                  resolve(null);
                }
              }
            }
          );
        });
        if (records != null) {
          totalAmounts.push(records);
        }
      }
      const uniqueArray = totalAmounts.filter((thing, index) => {
        const _thing = JSON.stringify(thing);
        return (
          index ===
          totalAmounts.findIndex((obj) => {
            return JSON.stringify(obj) === _thing;
          })
        );
      });

      resolve(uniqueArray);
    });
    // console.log(res2)
    // the payer is not fetched in res2 because he doesn't have ower id so the group does not show any information about the payer
    let res4 = await new Promise(async (resolve, reject) => {
      
      let newMembers = [];
      let newMembersObj = {};
      for (i = 0; i < res1.length; i++) {
        let found = 0;
        for (j = 0; j < res2.length; j++) {
          if (res1[i] == res2[j].ower_id) {
            found = 1;
            break;
          }
        }
        if (!found) newMembers.push(res1[i]);
      }
      // console.log("new mems")
      // console.log(newMembers)
      // console.log(newMembers.length)

      if (newMembers.length > 0) {
        await DB.query(
          `select * from transaction
        inner join user on transaction.payer_id=user.u_id
        inner join splitwiseTest.group on splitwiseTest.group.g_id=transaction.g_id
        where splitwiseTest.group.g_id=? and transaction.payer_id=?;`,
          [group_id, newMembers[0]],
          async (err, result) => {
            if (err) {
              reject(err);
              
            } else {
              // console.log("result length "+result.length)
              if (result.length >= 1) {
                newMembersObj = {
                  amount_owed: 0,
                  name: result[0].name,
                  group_name: result[0].g_name,
                };
                // console.log("new mem object")
                // console.log(newMembersObj)
                resolve(newMembersObj);
              } else {
                resolve(null);
              }
            }
          }
        );
      } else {
        resolve(null);
      }
    });
    
    if (res4 != null) {
      if (Object.keys(res4).length != 0) {
        res2.push(res4);
      }
    }
    

    //for payer
    let res3 = await new Promise(async (resolve, reject) => {
     
      let totalAmounts = [];
      for (i = 0; i < res1.length; i++) {
        let records = await new Promise((resolve, reject) => {
          DB.query(
            `select * from ower 
            inner join transaction on transaction.t_id = ower.t_id
            inner join user on user.u_id=transaction.payer_id
            where payer_id =? and g_id =? and is_settled=?`,
            [res1[i], group_id, 0],
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                if (result.length > 0) {
                  let amounts = {};
                  amounts["amount_toGetBack"] = 0.0;
                  for (let i = 0; i < result.length; i++) {
                    amounts["name"] = result[i].name;
                    amounts["payer_id"] = result[i].payer_id;
                    amounts["amount_toGetBack"] += result[i].amount_owed;
                  }
                  resolve(amounts);
                } else {
                  resolve(null);
                }
              }
            }
          );
        });
        if (records != null) {
          totalAmounts.push(records);
        }
      }
      if (totalAmounts) resolve(totalAmounts);
      else {
        resolve(null);
      }
    });
    // console.log(res3)
    //check where the name from payer and ower matches, change the owed amount(res2 is for ower and res3 for payer)
    // console.log(res3)
    // console.log(res2)
    if (res3 != null && res2 != null) {
      for (i = 0; i < res2.length; i++) {
        for (j = 0; j < res3.length; j++) {
          if (res3[j].name == res2[i].name) {
            res2[i].amount_owed -= res3[j].amount_toGetBack;
          }
        }
      }
    }
    
    res.status(200).send(res2);
    
  } catch (err) {
   
    res.status(400).json({ msg: err });
  }
});

//to diplay how much he owes in a particular group
// app.get("/owe", (req, res) => {
//   var current_user = parseInt(req.header("user"));
//   var group_id = parseInt(req.params.g_id);

//   DB.query(
//     `SELECT *
//   FROM transaction INNER JOIN ower
//   ON transaction.t_id = ower.t_id
//   INNER JOIN splitwiseTest.group
//   ON transaction.g_id = splitwiseTest.group.g_id
//   INNER JOIN splitwiseTest.user
//   ON splitwiseTest.user.u_id = transaction.payer_id
//   WHERE ower_id=? and is_settled=?;`,
//     [current_user, 0],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log(owed_map);

//         let gmap = {};
//         for (let row of result) {
//           let usr_details = {
//             u_name: row.name,
//             u_id: row.u_id,
//             amount_owed: owed_map[row.payer_id],
//           };

//           let owed_map = {};
//           for (let row1 of result) {
//             if (owed_map[row1.payer_id] && row1.g_id == row.g_id) {
//               owed_map[row1.payer_id] += row1.amount_owed;
//             } else {
//               owed_map[row1.payer_id] = row1.amount_owed;
//             }
//           }
//           if (
//             gmap[row.g_id] &&
//             !gmap[row.g_id].find((e) => e.u_id == usr_details.u_id)
//           ) {
//             gmap[row.g_id].push(usr_details);
//           } else {
//             gmap[row.g_id] = [usr_details];
//           }
//         }
//         res.send(gmap);
//       }
//     }
//   );
// });
//to get joined groups on didMount
app.get("/groups/joined", (req, res) => {
  var current_user = parseInt(req.header("user"));

  DB.query(
    `SELECT * FROM splitwiseTest.members join splitwiseTest.group where splitwiseTest.members.g_id = splitwiseTest.group.g_id and u_id=? and isaccepted=?`,
    [current_user, 1],
    (err, result) => {
      if (err) {
       
        res.status(400).send({ msg: err });
      } else {
        // console.log(result)
        let dbjoinedGroup = [];
        for (let i = 0; i < result.length; i++) {
          let joinedgroupobj = {
            g_id: result[i].g_id,
            name: result[i].g_name,
          };
          dbjoinedGroup.push(joinedgroupobj);
        }
        res.status(200).send(dbjoinedGroup);
      }
    }
  );
});
app.post("/dashboard/getPerson", (req, res) => {
  var current_user = parseInt(req.header("user"));

  DB.query(
    `select * from ower
  inner join transaction on ower.t_id= transaction.t_id
  inner join user on transaction.payer_id = user.u_id
  where ower_id=? and g_id=? and user.name LIKE '%${req.body.name}%'`,
    [current_user, req.body.g_id],
    (err, result) => {
     
      if (err) {
     
        res.status(400).send({ msg: err });
      } else {
        let dbPersonNames = [];
        for (let i = 0; i < result.length; i++) {
          let personNamesObj = {
            payer_id: result[i].payer_id,
            name: result[i].name,
          };
          dbPersonNames.push(personNamesObj);
        }
        const uniqueArray = dbPersonNames.filter((thing, index) => {
          const _thing = JSON.stringify(thing);
          return (
            index ===
            dbPersonNames.findIndex((obj) => {
              return JSON.stringify(obj) === _thing;
            })
          );
        });
        // console.log(uniqueArray)
        res.status(200).send(uniqueArray);
      }
    }
  );
});
app.post("/dashboard/settle", (req, res) => {
  var current_user = parseInt(req.header("user"));
 
  DB.query(
    `update ower inner join splitwiseTest.transaction on ower.t_id=transaction.t_id
  set ower.is_settled=? where ower.ower_id =? and transaction.g_id=? and transaction.payer_id=?
  and transaction.t_created_at < NOW()
  `,
    [1, current_user, req.body.g_id, req.body.payer_id],
    (err, result) => {
      if (err) {
        
        res.status(400).json({ msg: "Not settled!!!" });
      } else {
      
        res.status(200).json({ msg: "Settled!!!" });
      }
    }
  );
});
//to get suggested groups where he is a member(for MyGroup.js and dashboard)
app.post("/getGroups", (req, res) => {
  var current_user = parseInt(req.header("user"));

  DB.query(
    `SELECT * FROM splitwiseTest.members join splitwiseTest.group where splitwiseTest.members.g_id = splitwiseTest.group.g_id and u_id=? and isaccepted=? and splitwiseTest.group.g_name LIKE '%${req.body.gname}%' `,
    [current_user, 1],
    (err, result) => {
      if (err) {
       
        res.status(400).send({ msg: err });
      } else {
        let dbgroupnames = [];
        for (let i = 0; i < result.length; i++) {
          let groupobj = {
            g_id: result[i].g_id,
            name: result[i].g_name,
          };
          dbgroupnames.push(groupobj);
        }
        res.status(200).send(dbgroupnames);
      }
    }
  );
});

//display groups where he is invited(for MyGroup.js)
app.get("/groups/invites", (req, res) => {
  var current_user = parseInt(req.header("user"));

  DB.query(
    `SELECT * FROM members join splitwiseTest.group where members.g_id = group.g_id and u_id=? and isaccepted=? `,
    [current_user, 0],
    (err, result) => {
      if (err) {
       
        res.status(400).send({ msg: err });
      } else {
        let dbNotJoinedGroups = [];
        for (let i = 0; i < result.length; i++) {
          let notgroupobj = {
            g_id: result[i].g_id,
            name: result[i].g_name,
          };
          dbNotJoinedGroups.push(notgroupobj);
        }
        // console.log(dbNotJoinedGroups);
        res.status(200).send(dbNotJoinedGroups);
      }
    }
  );
});

//For user to be a part of a particular group, accept join request(for MyGroup.js)
app.put("/groups/:id/accept", (req, res) => {
  var current_user = parseInt(req.header("user"));
  var group_id = parseInt(req.params.id);

  DB.query(
    `UPDATE splitwiseTest.members SET isaccepted=? where g_id=? and u_id=?`,
    [1, group_id, current_user],
    (err, result) => {
      if (err) {
        
        res.status(400).send({ msg: err });
      } else {
        // console.log("User is now a part of the group");
        res.status(200).json({ msg: "User is now a part of the group " });
      }
    }
  );
});
//to get current group name for group.js
app.get("/currentGroupDetails", (req, res) => {
  var group_id = parseInt(req.query.g_id);

  DB.query(
    `select * from splitwiseTest.group where g_id = ?`,
    [group_id],
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send(result[0].g_name);
      }
    }
  );
});
// to get current user details(for Group.js)
app.get("/currentUserDetails", (req, res) => {
  var current_user = parseInt(req.header("user"));

  DB.query(`Select * from user where u_id=?`, [current_user], (err, result) => {
    if (err) {
      res.send(err);
    } else {
      let curr = {
        default_currency: result[0].default_currency,
      };
      res.send(curr);
    }
  });
});
//display the recent expenses of the group(for Group.js)
app.get("/groups/expenses", (req, res) => {
  

  var group_id = parseInt(req.query.g_id);
  DB.query(
    `Select * from transaction INNER JOIN user ON transaction.payer_id=user.u_id and g_id=? order by t_created_at DESC`,
    [group_id],
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        let group_details = [];
        for (let i = 0; i < result.length; i++) {
          let obj = {
            amount: result[i].amount,
            payer_name: result[i].name,
            description: result[i].description,
            created_at: result[i].t_created_at,
          };
          group_details.push(obj);
        }
        res.send(group_details);
      }
    }
  );
});

//add expense which adds data in transaction as well as in the ower table(for Group.js)
app.post("/addexpense/:g_id", async (req, res, next) => {
  var current_user = parseInt(req.header("user"));
  var group_id = parseInt(req.params.g_id);
 
  try {
    let res2 = await new Promise((resolve, reject) => {
      DB.query(
        `SELECT * FROM members WHERE g_id=? and isaccepted=?`,
        [group_id, 1],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            if (result.length > 1) {
            
              group_members = [];
              for (index = 0; index < result.length; index++) {
                group_members[index] = result[index].u_id;
              }
             
              resolve(group_members);
            } else {
              reject("No member in group");
            }
          }
        }
      );
    });

    let res1 = await new Promise((resolve, reject) => {
      
      DB.query(
        `INSERT INTO transaction(g_id,payer_id,amount,currency,description) VALUES(?,?,?,?,?)`,
        [
          group_id,
          current_user,
          req.body.amount,
          req.body.currency,
          req.body.description,
        ],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.insertId);
          }
        }
      );
    });

    for (index = 0; index < res2.length; index++) {
      if (res2[index] != current_user) {
        let res3 = await DB.query(
          `INSERT INTO ower(ower_id,t_id,amount_owed) VALUES (?,?,?)`,
          [res2[index], res1, req.body.amount / res2.length],
          (err, result) => {
            if (err) {
            
              
            } else {
              console.log("inserted into ower");
              console.log(result);
            }
          }
        );
      }
    }
    res.status(200).send({ msg: "Transaction Inserted successfully" });
  } catch (err) {
    
    res.status(400).json({ msg: err });
  }

  // console.log(res1);
  // console.log("hello");
  // console.log(res2);
});

//to get the suggested emails for creating group(for Group.js)
app.post("/getInfo2", (req, res) => {
 
  DB.query(
    `SELECT * FROM user WHERE email LIKE '%${req.body.email}%'`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        let userEmails = [];
        for (i = 0; i < result.length; i++) {
          let obj = {
            id: result[i].u_id,
            email: result[i].email,
            name: result[i].name,
          };
          userEmails.push(obj);
        }
        res.status(200).send(userEmails);
      }
    }
  );
});

//to get the suggested names for creating group(for Group.js)
app.post("/getInfo", (req, res) => {
  
  DB.query(
    `SELECT * FROM user WHERE name LIKE '%${req.body.name}%'`,
    (err, result) => {
      if (err) {
        
      } else {
        let usernames = [];
        for (i = 0; i < result.length; i++) {
          let obj = {
            id: result[i].u_id,
            name: result[i].name,
          };
          usernames.push(obj);
        }
        res.status(200).send(usernames);
      }
    }
  );
});
//to create a group(for CreateGroup.js)
app.post("/groups", (req, res) => {
  const groupInfo = {
    g_name: req.body.g_name,
    g_desc: req.body.g_desc,
    users: req.body.users,
  };
  

  DB.query(
    `INSERT INTO splitwiseTest.group(g_name) VALUES (?)`,
    [req.body.g_name],
    (err, result) => {
      if (err) {
       
        res.status(400).send({ msg: err });
      } else {
       
      }
    }
  );

  //callback for enterting data into group and getting the groupid
  group_id(mem);
  function group_id(callback) {
    DB.query(`SELECT LAST_INSERT_ID() as g_id`, (err, result) => {
      if (result) {
        
        callback(result[0].g_id);
      }
    });
  }

  function mem(id) {
    group_admin = parseInt(req.header("user"));
    DB.query(
      `INSERT INTO splitwiseTest.members(g_id,u_id,isaccepted) VALUES (?,?,?)`,
      [id, group_admin, 1],
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log("added group admin in table");
        }
      }
    );
    for (index = 0; index < groupInfo.users.length; index++) {
      DB.query(
        `INSERT INTO splitwiseTest.members(g_id,u_id) VALUES (?,?)`,
        [id, groupInfo.users[index]],
        (err, result) => {
          if (err) {
            res.status(400).json({ msg: err });
          } else {
            console.log("members added successfully");
          }
        }
      );
    }
    res.status(200).json({ msg: "Group Created successfully" });
  }
});

//updating the details of user from user profile(for ProfilePage.js)
app.put("/profile", (req, res) => {
  

  DB.query(
    `UPDATE user SET name=?,email=?,phone_number=?,default_currency=?,timezone=?,language=? where u_id=?`,
    [
      req.body.username,
      req.body.email,
      req.body.phoneNumber,
      req.body.defaultCurrency,
      req.body.timezone,
      req.body.language,
      req.body.id,
    ],
    (err, result) => {
      if (err) {
        res.send({ msg: err });
      }
      
      if (result) {
        res.send(result);
      }
    }
  );
});

//getting the user details for profile page
app.post("/profile", (req, res) => {
 
  DB.query(
    `SELECT * FROM user where email=?`,
    [req.body.email],
    (err, result) => {
      if (err) {
        res.send({ msg: err });
      }

      if (result.length > 0) {
        
        res.send(result);
      }
    }
  );
});

app.post("/login", async (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).json({ msg: "All fields required" });
    return;
  }

  DB.query(
    `SELECT * FROM user where email=?`,
    [req.body.email],
    (err, result) => {
      if (err) {
        res.status(400).send({ msg: err });
      } else {
        if (result.length > 0) {
          if (bcrypt.compareSync(req.body.password, result[0].password)) {

            res.send(result);
          } else {
            res.status(401).json({ msg: "Invalid Credentials!!" });
          }
        } else {
          res.status(401).json({ msg: "Invalid Credentials!!" });
        }
      }
    }
  );
});
app.post("/signup", async (req, res) => {
  console.log("in signup")
  if (
    req.body.name === "" ||
    req.body.email === "" ||
    req.body.password === ""
  ) {
    res.status(400).json({ msg: "All fields required" });
  }

  let hashedpassword = await bcrypt.hash(req.body.password, 10);
  DB.query(
    `INSERT INTO user (name,email,password) VALUES (?,?,?)`,
    [req.body.name, req.body.email, hashedpassword],
    (err, result) => {
      if (err) {
        res.status(400).send({ msg: err.sqlMessage });
        return;
      }
      if (result) {
        
        res.status(200).send({ id: result.insertId });
        // res.send(result)
      } else {
        res.send({ registeredFlag: true });
      }
    }
  );
});

app.listen(3001, () => {
  console.log("running on the port 3001");
});

module.exports= app