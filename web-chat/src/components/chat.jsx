import React, { Component } from "react";
import * as signalR from "@aspnet/signalr";

class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      messages: [],
      messageText: null,
      name: null,
      group: null,
      hubConnection: null,
    };
  }

  componentWillMount() {
    this.state.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5012/chatHub")
      //.configureLogging(signalR.LogLevel.Information)
      .configureLogging(signalR.LogLevel.Debug)
      .build();
    console.log(this.hubConnection);

  }


  componentDidMount() {

    const name = window.prompt('Your name:', 'Vesi');

    fetch("http://localhost:5000/api/messages")
      .then(res => res.json())
      .then(
        result => {
          this.setState({
            isLoaded: true,
            messages: result
          });
        });

    // this.hubConnection = new signalR.HubConnectionBuilder()
    //   .withUrl("http://localhost:5012/chatHub")
    //   .configureLogging(signalR.LogLevel.Information)
    //   .build();


    //  this.setState({ hubConnection, name }, () => {
    this.state.hubConnection
      .start()
      .then(() => {
        console.info("SignalR connected");
      },
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        });
    // Note: it's important to handle errors here
    // instead of a catch() block so that we don't swallow
    // exceptions from actual bugs in components.


    this.state.hubConnection.on('SendMessageToGlobalGroup', (name, receivedMessage) => {
      const text = `${name}: ${receivedMessage}`;
      const messages = this.state.messages.concat([text]);
      this.setState({ messages });
    });



    this.state.hubConnection.on("ReceiveGlobalMessage", (message) => {
      console.log(message);
      console.log("messages: " + this.state.messages)
      const messages = this.state.messages;
      messages.push(message);
      this.setState({ messages });
    });
  }

  sendMessage = () => {
    this.state.hubConnection
      .invoke("SendMessageToGlobalGroup", this.state.messageText)
      .catch(err => console.error(err));

    this.setState({ messageText: '' });
  };

  render() {
    //object destructoring
    const { error, isLoaded, messages, messageText } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else if (messages.lenght === 0) return <p> No messages</p>;
    else {
      console.log(messages);
      return (
        <div>
          <ul>
            {messages.map((message, index) => (
              <div key={index}>
                <p>
                  User:{message.userId}: {message.text}{" "}
                </p>
                <p>{message.date}</p>
              </div>
            ))}
          </ul>
          <br />
          <input
            type="text"
            value={messageText}
            onChange={e => this.setState({ messageText: e.target.value })}
          />

          <button onClick={this.sendMessage}>Send</button>
        </div>



      );
    }
  }
}

export default Chat;
