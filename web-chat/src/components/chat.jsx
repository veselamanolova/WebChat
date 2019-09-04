import React, { Component } from "react";

class Chat extends Component {
  state = {};
  render() {
    //object destructoring
    const { error, isLoaded, messages } = this.props;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else if (messages.lenght === 0) return <p> No messages</p>;
    else {
      return (
        <ul>
          {messages.map(message => (
            <div key={message.Id}>
              <p>
                User:{message.UserId}: {message.Text}{" "}
              </p>
              <p>{message.Date}</p>
            </div>
          ))}
        </ul>
      );
    }
  }
}

export default Chat;
