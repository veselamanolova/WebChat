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
      userData: {}
    };
  }

  componentDidMount() {
    var userData = localStorage.getItem('logedInUserData');

    if (userData) {
      var userDataObj = JSON.parse(userData);
      this.setState({
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
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <a className="navbar-brand" href="#">Chat</a>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item active">
                    <Link to="/" className="nav-link active">Home<span className="sr-only">(current)</span></Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/users" className="nav-link">Users</Link>
                  </li >
                  <li className="nav-item">
                    <Link to="/groups" className=" nav-link">Groups</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/newgroup" className="nav-link">New Group</Link>
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
