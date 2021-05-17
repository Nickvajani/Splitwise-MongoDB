var chai = require('chai');
const chaiHttp = require('chai-http')
chai.use(chaiHttp)
var app = require('../index')
var expect = chai.expect;
var agent= chai.request.agent(app)

describe("Get total Amount", () =>{
    it("GET /dashboard/getTotalGet", (done)=> {
        agent.get("/dashboard/getTotalGet")
        .then(function (res) {

            expect(res).to.have.status(200)  
            done();
        })
        .catch((e) => {
            done(e)
        })
    })
})
describe("Get total Amount", () =>{
    it("GET /dashboard/getTotalOwe", (done)=> {
        agent.get("/dashboard/getTotalOwe")
        .then(function (res) {

            expect(res).to.have.status(200)  
            done();
        })
        .catch((e) => {
            done(e)
        })
    })
})

describe("Put profile", () =>{
    it("PUT /profile", (done)=> {
        let user ={
            id:"6066cb0754b39f228494968a",
            defaultCurrency:"USD" ,
            email:"nick2@gmail.com",
            phoneNumber:"7990543556",
            username:"Nick2"          
        }
        agent.put("/profile/update")
        .send(user)
        .then(function (res) {
            expect(res).to.have.status(200)  
            done();
        })
        .catch((e) => {
            done(e)
        })
    })
})

describe("Post signup", () =>{
    it("POST /signup", (done)=> {
        let user ={
            name:"harsh",
            email: "soni1@gmail.com",
            password: "user"
        }
        agent.post("/user/signup")
        .send(user)
        .then(function (res) {
            expect(res).to.have.status(200)  
            done();
        })
        .catch((e) => {
            done(e)
        })
    })
})

describe("Get profile", () =>{
    it("get /profile", (done)=> {
        let user ={
            email: "nick@gmail.com",
        }
        agent.post("/profile/get")
        .send(user)
        .then(function (res) {
            expect(res).to.have.status(200)  
            done();
        })
        .catch((e) => {
            done(e)
        })
    })
})

