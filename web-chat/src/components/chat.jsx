import React, { Component } from "react";
import * as signalR from "@aspnet/signalr";

class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      messages: [],
      totalMessages: 0,
      skip: null,
      numberOfMessagesToRequest: 5,
      pages: null,
      currentPage: null,
      messageText: "",
      userId: "",
      group: null,
      groupId: null,
      name: "Public group",
      hubConnection: null,
      previousMessageUserId: "",
      isPreviousMessageFromTheSameUser: false,
      searchText: "",
      smallDeviceSearchVisible: false
    };
  }


  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView();
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

    let hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(window.webChatConfig.signalRHubAddress, {
        accessTokenFactory: () => token
      })
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


          this.state.hubConnection.on("ReceiveGroupMessage", (message) => {
            const messages = this.state.messages;
            messages.push(message);
            this.setState({ messages });
          });
        }
        else {

          this.state.hubConnection.on("ReceiveGlobalMessage", (message) => {
            const messages = this.state.messages;
            messages.push(message);
            this.setState({ messages });
          });
        }
      }
    );

    this.loadMessages();

    this.scrollToBottom();
  }

  toggleSearch = () => {
    this.setState({
      smallDeviceSearchVisible: !this.state.smallDeviceSearchVisible
    });
  }

  loadMessages = () => {
    const { searchText, numberOfMessagesToRequest } = this.state;
    let groupIdStr = "";
    if (this.props.groupId) {
      groupIdStr = this.props.groupId;
    }

    let searchTextStr = "";
    if (searchText) {
      searchTextStr = "?search=" + this.state.searchText;
    }

    fetch(window.webChatConfig.webApiAddress + "/messages/" + groupIdStr + searchTextStr, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "Authorization": "Bearer " + this.props.userData.token
      }
    })
      .then(res => res.json())
      .then(result => {
        this.setState({
          isLoaded: true,
          messages: result.messages,
          totalMessages: result.totalMessages,
          smallDeviceSearchVisible: false
        });
      });

  }



  componentDidUpdate() {
    if (this.state.messages.length > 0) {
      this.scrollToBottom();
    }
  }

  componentWillUnmount() {
    if (this.state.hubConnection != null) {
      this.state.hubConnection.stop();
    }
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
      this.props.sendMessageAllert();
    }
  };

  keyPressed = (event) => {
    if (event.key === "Enter") {
      this.sendMessage()
    }
  }

  render() {
    const { userId, userName, token } = this.props.userData;
    const { error, isLoaded, messages, messageText, groupId, name, searchText } = this.state;
    let { previousMessageUserId, isPreviousMessageFromTheSameUser } = this.state;
    let chatDivStyle = {
      overflowY: 'scroll',
      height: 'calc(100vh - 150px)',
      border: '1px solid lightgrey'
    };
    let sendMessageDivStyle = {
      height: '10vh',
    };

    if (error) {
      return <div>Error: {error.message}</div>;
    }
    else {
      return (
        <div className="container" >
          <div>
            <div className="d-flex">
              <div className="d-block d-lg-none">
                <button type="button" className="btn btn-outline-secondary btn-sm mr-1"
                  title="show groups" onClick={this.props.showGroupsOnSmallScreen}>
                  <i class="fa fa-arrow-left" aria-hidden="true"></i>
                </button>
              </div>
              <div class="flex-grow-1">
                <h5 className={(this.state.smallDeviceSearchVisible ? "d-none d-lg-inline" : "")}>{name}</h5>
              </div>
              <div>
                <div class="form-inline">
                  <div class="input-group">
                    <input className={("form-control form-control-sm" + (this.state.smallDeviceSearchVisible ? "" : " d-none d-lg-inline"))}
                      type="text" placeholder="Search messages" value={searchText} onChange={e => this.setState({ searchText: e.target.value })} />
                    <div class="input-group-append">
                      <button className={("btn btn-sm btn-outline-secondary" + (this.state.smallDeviceSearchVisible ? "" : " d-none d-lg-inline"))}
                        onClick={this.loadMessages} title="Search">
                        <i class="fas fa-search"></i>
                      </button>
                      <button className={("btn btn-sm btn-outline-secondary" + (!this.state.smallDeviceSearchVisible ? " d-inline d-lg-none" : " d-none"))}
                        onClick={this.toggleSearch} title="Search">
                        <i class="fas fa-search"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={chatDivStyle}>

              {
                <h1 className="text-center"> {!isLoaded ? <i class="fas fa-spinner fa-pulse"></i> : ""}</h1>
              }
              {

                (isLoaded && messages.length == 0) ? <p className="p-2"> No messages</p> : ""
              }
              {
                messages.map((message, index) => {

                  const isCurrentUserMessage = message.userId === userId;
                  isPreviousMessageFromTheSameUser = (previousMessageUserId === message.userId);
                  previousMessageUserId = message.userId

                  return <div key={index} class="p-2" style={{ ["margin-" + (isCurrentUserMessage ? "left" : "right")]: "25%" }} >
                    {
                      (isPreviousMessageFromTheSameUser || isCurrentUserMessage)
                        ? ""
                        : <span>
                          {
                            (message.profilePicturePath) ?
                              <img src={window.webChatConfig.webApiPictureAddress + message.profilePicturePath}
                                class="rounded-circle" width="25" height="25"></img>
                              : ""
                          }
                          {message.userName}
                        </span>

                    }

                    < div class={"alert alert-" + (isCurrentUserMessage ? "primary" : "secondary")}>
                      {message.text} <span class="badge badge-info">{new Date(message.date).toLocaleString()}</span>
                    </div>
                  </div>
                }
                )}
              <div style={{ float: "left", clear: "both" }}
                ref={(el) => { this.messagesEnd = el; }}>
              </div>
            </div>

            <div class="d-flex">
              <div class="p-2 flex-grow-1">
                <input className="form-control" type="text" placeholder="Type message here"
                  value={messageText} onKeyPress={this.keyPressed} onChange={e => this.setState({ messageText: e.target.value })} />
              </div>
              <div class="p-2 bd-highlight">
                <button className="btn btn-primary" onClick={this.sendMessage
                }>Send</button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default Chat;
