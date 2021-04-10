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

describe("Put profile", () =>{
    it("PUT /profile", (done)=> {
        let user ={
            email: "nick@gmail.com",
            id: 99
        }
        agent.put("/profile")
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
            name:"naitik",
            email: "nicccc@gmail.com",
            password: "nick123"
        }
        agent.post("/signup")
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

describe("Post profile", () =>{
    it("POST /profile", (done)=> {
        let user ={
            email: "nic@gmail.com",
        }
        agent.post("/profile")
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

