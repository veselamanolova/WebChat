import React, { Component } from "react";
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'
import Chat from "./components/chat";
import Login from "./components/login";
import Notfound from "./components/notfound";
import Users from "./components/users";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // userName: null,
      // token: null
      userData: {}
    };
  }

  componentDidMount() {
    var userData = localStorage.getItem('logedInUserData');
    console.log("check if userDataExists" + userData);

    if (userData) {
      console.log("in if statement")
      var userDataObj = JSON.parse(userData);
      this.setState({
        // userName: userDataObj.userName,
        // token: userDataObj.token
        userData: userDataObj
      });
    }
  }

  render() {

    if (this.state.userData && this.state.userData.token) {
      console.log("in state token")
      return (
        <Router>
          <div>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/users">Users</Link>
              </li>
              <li>
                <Link to="/groups">Groups</Link>
              </li>
            </ul>
            <Switch>
              <Route exact path="/" component={() => <Chat userData={this.state.userData} />} />
              <Route path="/users" component={() => <Users userData={this.state.userData} />} />
              <Route path="/groups" component={Chat} />
              <Route component={Notfound} />
            </Switch>
          </div>
        </Router>
      );
    }
    else {
      return (
        <React.Fragment>
          <main className="container">
            <Login />
          </main>
        </React.Fragment>
      );
    }

  }
}

export default App;
