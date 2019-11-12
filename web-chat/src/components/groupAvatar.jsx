import React, { Component } from "react";

class GroupAvatar extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        const { usersInfo, logedInUserId } = this.props;
        return (
            <div>
                {(usersInfo[0]) &&
                    (usersInfo[0].id != logedInUserId) &&
                    (usersInfo[0].profilePicturePath !== "") ?
                    <img src={window.webChatConfig.webApiPictureAddress + usersInfo[0].profilePicturePath}
                        className="rounded-circle d-inline" width="30" height="30" style={{
                            "position": "absolute",
                            //"clip": `rect(${0}px,${50}px,${25}px,${0}px)`,//left
                            "clip": `rect(${0}px,${30}px,${30}px,${0}px)`,//left  
                            // "zIndex": 0
                        }} ></img> : ""}


                {(usersInfo[1]) &&
                    (usersInfo[1].id != logedInUserId) &&
                    (usersInfo[1].profilePicturePath !== "") ?
                    <img src={window.webChatConfig.webApiPictureAddress + usersInfo[1].profilePicturePath}
                        className="rounded-circle d-inline" width="30" height="30" style={{
                            "position": "absolute",
                            "clip": `rect(${0}px,${30}px,${30}px,${15}px)`,//right  
                            // "clip": `rect(${0}px,${50}px,${25}px,${25}px)`//right up   
                            //  "zIndex": 1
                        }} ></img> : ""}

                {(usersInfo[2]) &&
                    (usersInfo[2].id != logedInUserId) &&
                    (usersInfo[2].profilePicturePath !== "") ?
                    <img src={window.webChatConfig.webApiPictureAddress + usersInfo[2].profilePicturePath}
                        className="rounded-circle d-inline" width="30" height="30" style={{
                            "position": "absolute",
                            "clip": `rect(${15}px,${30}px,${30}px,${15}px)`,//right down
                            //  "zIndex": 1
                        }} ></img> : ""}

            </div>
        );
    }
}


export default GroupAvatar;