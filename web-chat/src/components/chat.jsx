import React, { Component } from "react";
import * as signalR from "@aspnet/signalr";

class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      messages: [],
      messageText: "",
      name: null,
      userId: "f5133dd5-fa37-4ba0-b8ef-b8fcaacec8d3",
      group: null,
      groupId: null,
      hubConnection: null,
    };
  }

  componentDidMount() {

    const { userId, userName, token, groupId } = this.props.userData;

    let hubConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5012/chatHub")
      .configureLogging(signalR.LogLevel.Debug)
      .build();

    this.setState({ hubConnection },
      () => {
        this.state.hubConnection
          .start()
          .then(() => {
            console.info("SignalR connected");
            if (this.state.groupId != null && this.state.groupId > 0) {
              this.state.hubConnection.invoke("JoinToGroup", this.state.groupId)
                .catch(function (err) {
                  return console.error(err.toString());
                });
            }
          },
            error => {
              this.setState({
                isLoaded: true,
                error
              });
            });

        if (groupId != null && groupId > 0) {

          this.state.hubConnection.on("SendMessageToGroup", (name, message, groupId, receivedMessage) => {
            const text = `${name}: ${receivedMessage}`;
            const messages = this.state.messages.concat([text]);
            this.setState({ messages });

          });

          this.state.hubConnection.on("ReceiveGroupMessage", (message) => {
            const messages = this.state.messages;
            messages.push(message);
            this.setState({ messages });
          });
        }
        else {
          this.state.hubConnection.on('SendMessageToGlobalGroup', (name, receivedMessage) => {
            const text = `${name}: ${receivedMessage}`;
            const messages = this.state.messages.concat([text]);
            this.setState({ messages });
          });

          this.state.hubConnection.on("ReceiveGlobalMessage", (message) => {
            const messages = this.state.messages;
            messages.push(message);
            this.setState({ messages });
          });
        }
      }
    );

    let groupIdStr = "";
    if (groupId) {
      groupIdStr = groupId;
    }

    fetch("http://localhost:5000/api/messages/" + groupIdStr, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(result => {
        this.setState({
          isLoaded: true,
          messages: result
        });
      }
      );
  }

  componentWillUnmount() {
    this.state.hubConnection.stop();
  }

  sendMessage = () => {
    if (this.state.groupId == null) {
      this.state.hubConnection
        .invoke("SendMessageToGlobalGroup", this.state.messageText)
        .catch(err => console.error(err));

      this.setState({ messageText: '' });
    } else {
      this.state.hubConnection
        .invoke("SendMessageToGroup", this.state.messageText, this.state.groupId)
        .catch(err => console.error(err));

      this.setState({ messageText: '' });
    }
  };

  render() {
    const { error, isLoaded, messages, messageText } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else if (messages.lenght === 0) return <p> No messages</p>;
    else {
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
