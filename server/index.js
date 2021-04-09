const express = require("express");
var bodyParser = require("body-parser");

var cors = require("cors");
var bcrypt = require("bcryptjs");
const moment = require("moment");
const { json } = require("body-parser");
const fileUpload = require("express-fileupload");

const mongoose = require("mongoose");
const app = express();

const userRouter = require('./routes/api/user')
const profileRouter = require('./routes/api/profile')
const creategroupRouter = require('./routes/api/createGroup')
const mygroupRouter = require('./routes/api/mygroups')
const groupRouter = require('./routes/api/group')
const dashboardRouter = require('./routes/api/dashboard')
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));

//DB Config
const db = require('./config/keys').mongoURI;
const Group = require("./models/createGroupModel");

//connect to Mongo
mongoose
  .connect(db, {poolSize: 500,useCreateIndex: true ,useNewUrlParser: true})
  .then(()=> console.log('Mongo connected........'))
  .catch(err => console.log(err))

//use routes
app.use('/user', userRouter)
app.use('/profile', profileRouter)
app.use('/creategroup', creategroupRouter)
app.use('/mygroups', mygroupRouter)
app.use('/groups', groupRouter)
app.use('/dashboard', dashboardRouter)

app.listen(3001, () => {
  console.log("running on the port 3001");
});

module.exports = app;
