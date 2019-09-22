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
      userId: "",
      group: null,
      groupId: null,
      name: "Public group",
      hubConnection: null,
      previousMessageUserId: "",
      isPreviousMessageFromTheSameUser: false
    };
  }

  componentDidMount() {

    const { userId, userName, token } = this.props.userData;
    if (this.props.groupId) {
      this.setState({ groupId: this.props.groupId });
    }
    if (this.props.name) {
      this.setState({ name: this.props.name });
    }

    const { name, groupId } = this.props;

    console.log(name + " " + groupId);

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
            if (this.props.groupId != null && this.props.groupId > 0) {
              this.state.hubConnection.invoke("JoinToGroup", this.props.groupId)
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
    this.state.messages = [];
  }

  sendMessage = () => {
    if (this.props.groupId == null) {
      this.state.hubConnection
        .invoke("SendMessageToGlobalGroup", this.state.messageText)
        .catch(err => console.error(err));

      this.setState({ messageText: '' });
    } else {
      this.state.hubConnection
        .invoke("SendMessageToGroup", this.state.messageText, this.props.groupId)
        .catch(err => console.error(err));

      this.setState({ messageText: '' });
    }
  };



  render() {
    const { userId, userName, token } = this.props.userData;
    const { error, isLoaded, messages, messageText, groupId, name } = this.state;
    let { previousMessageUserId, isPreviousMessageFromTheSameUser } = this.state;
    let chatDivStyle = {
      overflowY: 'scroll',
      height: 'calc(100vh - 142px)',
      border: '1px solid lightgrey'
    };
    let sendMessageDivStyle = {
      height: '10vh',
      // border: '1px solid lightgrey'
    };


    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else if (messages.lenght === 0) return <p> No messages</p>;
    else {
      return (
        <div className="container" >
          <h5>{name}</h5>
          <div style={chatDivStyle}>
            {messages.map((message, index) => {
              const isCurrentUserMessage = message.userId === userId;
              isPreviousMessageFromTheSameUser = (previousMessageUserId === message.userId);
              previousMessageUserId = message.userId

              return <div key={index} style={{ ["margin-" + (isCurrentUserMessage ? "left" : "right")]: "25%" }} >
                {
                  (isPreviousMessageFromTheSameUser || isCurrentUserMessage) ? "" : message.userName
                }

                < div class={"alert alert-" + (isCurrentUserMessage ? "primary" : "secondary")}>
                  {message.text} <span class="badge badge-info">{new Date(message.date).toLocaleTimeString()}</span>
                </div>
              </div>
            }

            )}
          </div>

          <div class="d-flex">
            <div class="p-2 flex-grow-1">
              <input className="form-control" type="text" placeholder="Type message here"
                value={messageText} onChange={e => this.setState({ messageText: e.target.value })} />
            </div>
            <div class="p-2 bd-highlight">
              <button className="btn btn-primary" onClick={this.sendMessage}>Send</button>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Chat;
