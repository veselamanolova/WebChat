import React, { Component } from "react";
import Chat from "./components/chat.jsx";
import NavBar from "./components/navbar.jsx";
import * as signalR from "@aspnet/signalr";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      messages: []
    };
  }

  componentDidMount() {
    fetch("http://localhost:5000/api/publicChat")
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            messages: result
          });

          this.connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5012/chatHub")
            .build();

          this.connection.on("ReceiveGlobalMessage", function(user, message) {
            debugger;
          });

          this.connection
            .start()
            .then(function() {
              console.info("SignalR connected");
            })
            .catch(function(err) {
              return console.error(err.toString());
            });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
    console.log(this.state.messages);
  }

  render() {
    return (
      <React.Fragment>
        {/* <NavBar user={this.state.user.name} /> */}

        <main className="container">
          <Chat
            error={this.state.error}
            isLoaded={this.state.isLoaded}
            messages={this.state.messages}
          />
        </main>
      </React.Fragment>
    );
  }
}

export default App;
