import React, { Component } from "react";
import { Route, Link, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'
import UserProfile from "./components/userProfile";
import Login from "./components/login";
import Notfound from "./components/notfound";
import Users from "./components/users";
import Groups from "./components/groups";

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

  updateLoggedInUser = (basicUserInfo) => {
    var storedUser = JSON.parse(localStorage.getItem('logedInUserData'));
    storedUser.userName = basicUserInfo.userName;
    localStorage.setItem('logedInUserData', JSON.stringify(storedUser));
    this.setState({
      userData: storedUser
    });
  }

  handleLogout = () => {

    localStorage.removeItem('logedInUserData');
    this.setState({
      userData: {}
    });
    // this.context.router.push('/'); 
    // return <Redirect push to="/" />;
    // window.location.reload();
  };

  render() {

    if (this.state.userData && this.state.userData.token) {
      console.log("in state token")
      return (
        <Router>
          <div>

            <nav class="navbar navbar-light bg-light">
              <Link to="/" className="navbar-brand">WebChat</Link>
              <div className="nav-item">
                <Link to="/users" className="nav-link">Users</Link>
              </div >
              <Link to="/profile" className="nav-link ml-md-auto">Hi, {this.state.userData.userName}</Link>
              <a className="nav-link" href="#" onClick={this.handleLogout} title="Logout">
                <i class="fas fa-sign-out-alt"></i>
              </a>
            </nav>

            <Switch>
              <Route exact path="/" component={() => <Groups userData={this.state.userData} />} />
              <Route path="/users" component={() => <Users userData={this.state.userData} />} />
              <Route path="/groups" component={() => <Groups userData={this.state.userData} />} />
              <Route path="/profile" component={() => <UserProfile
                userData={this.state.userData}
                updateHandler={this.updateLoggedInUser}
              />} />
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
