import React, { Component } from "react";
import Chat from "./components/chat.jsx";
import Login from "./components/login.jsx";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userName: null,
      token: null
    };
  }

  componentDidMount() {
    var userData = localStorage.getItem('logedInUserData');
    console.log("check if userDataExists" + userData);

    if (userData) {
      console.log("in if statement")
      var userDataObj = JSON.parse(userData);
      this.setState.userName = userDataObj.userName;
      this.setState.token = userDataObj.token;
      console.log("state token" + this.setState.token);
    }
  }

  render() {
    if ([...this.state.token]) {
      console.log("in state token")
      return (
        <React.Fragment>
          <main className="container">
            <Chat
              userName={this.state.userName}
              token={this.state.token}
            />
          </main>
        </React.Fragment>
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
