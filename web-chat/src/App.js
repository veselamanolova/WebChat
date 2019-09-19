import React, { Component } from "react";
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'
import Chat from "./components/chat";
import Login from "./components/login";
import Notfound from "./components/notfound";
import Users from "./components/users";
import Groups from "./components/groups";
import CreateNewGroup from "./components/createNewGroup";

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
      debugger;
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
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
              <a class="navbar-brand" href="#">Chat</a>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
              </button>

              <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                  <li class="nav-item active">
                    <Link to="/" class="nav-link active">Home<span class="sr-only">(current)</span></Link>
                  </li>
                  <li class="nav-item">
                    <Link to="/users" class="nav-link">Users</Link>
                  </li >
                  <li class="nav-item">
                    <Link to="/groups" class=" nav-link">Groups</Link>
                  </li>
                  <li class="nav-item">
                    <Link to="/newgroup" class="nav-link">New Group</Link>
                  </li>
                </ul>
              </div>
            </nav>

            <Switch>
              <Route exact path="/" component={() => <Chat userData={this.state.userData} />} />
              <Route path="/users" component={() => <Users userData={this.state.userData} />} />
              <Route path="/groups" component={() => <Groups userData={this.state.userData} />} />
              <Route path="/newgroup" component={() => <CreateNewGroup userData={this.state.userData} />} />
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
