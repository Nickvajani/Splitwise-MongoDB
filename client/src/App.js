import logo from "./logo.svg";
import "./App.css";
import Login from "./Components/Login";
import Navbar from "./Components/Navbar";
import Signup from "./Components/Signup";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import { Container } from "react-bootstrap";
import ProfilePage from "./Components/ProfilePage";
import Dashboard from "./Components/Dashboard";
import CreateGroup from "./Components/CreateGroup"
import Group from "./Components/Group";
import MyGroup from "./Components/MyGroup";
import RecentActivity from "./Components/RecentActivity";
function App() {
  return (
    <Router>
      <div className="App">
      
          <Navbar />
          <Switch>
            <Route exact path="/" component={LandingPage}>
              <LandingPage></LandingPage>
            </Route>
            <Route path="/login" component={Login}>
              <Login></Login>
            </Route>
            <Route path="/signup" component={Signup}>
              <Signup></Signup>
            </Route>
            <Route path="/profile" component={ProfilePage}>
              <ProfilePage></ProfilePage>
            </Route>
            <Route path="/dashboard" component={Dashboard}>
              <Dashboard></Dashboard>
            </Route>
            <Route path="/recentactivity" component={RecentActivity}>
              <RecentActivity></RecentActivity>
            </Route>
            <Route path="/createGroup" component={CreateGroup} >
              <CreateGroup></CreateGroup>
            </Route>
            <Route path="/group" render={(props) => <Group {...props}></Group>} > 
              
            </Route>
            <Route path="/mygroups" component={MyGroup}>
              <MyGroup></MyGroup>
            </Route>
          </Switch>
       
      </div>
    </Router>
  );
}

export default App;
