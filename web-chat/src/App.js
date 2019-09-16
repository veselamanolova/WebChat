import React, { Component } from "react";
import Chat from "./components/chat.jsx";
import Login from "./components/login.jsx";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <React.Fragment>
        <main className="container">
          <Login />
        </main>
      </React.Fragment>
    );
  }
}

export default App;
