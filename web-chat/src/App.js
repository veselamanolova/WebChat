import React, { Component } from "react";
import { Route, Link, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'
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
              <a class="navbar-brand">WebChat</a>
              <div>
                <form class="form-inline">
                  {/* <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" />
                  <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button> */}
                  <div className="nav-link">Hi, {this.state.userData.userName}</div>
                  <a className="nav-link" href="#" onClick={this.handleLogout} >Logout</a>
                </form>
              </div>
            </nav>

            {/* <nav className="navbar navbar-expand-lg navbar-light bg-light">
              <a className="navbar-brand" href="#">Chat</a>
              <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                  <li className="nav-item">
                    <Link to="/groups" className=" nav-link">Groups</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/users" className="nav-link">Users</Link>
                  </li >
                </ul>

                <li class="nav navbar-nav navbar-right">
                  <div className="nav-link">
                    Hi, {this.state.userData.userName}
                  </div>
                </li>
                <li class="nav navbar-nav navbar-right mr-auto">
                  <div className="nav-link" onClick={
                    this.handleLogout
                  } >Logout</div>
                </li>


              </div>
            </nav> */}

            <Switch>
              <Route exact path="/" component={() => <Groups userData={this.state.userData} />} />
              <Route path="/users" component={() => <Users userData={this.state.userData} />} />
              <Route path="/groups" component={() => <Groups userData={this.state.userData} />} />
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
