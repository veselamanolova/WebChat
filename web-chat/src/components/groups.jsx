import React, { Component } from "react";
import { Route, Link, BrowserRouter as Router, Switch, withRouter } from 'react-router-dom';
import Chat from "./chat";
import { createBrowserHistory } from 'history';
import UserProfile from "./userProfile";
import Users from "./users";
import * as signalR from "@aspnet/signalr";
import axios from 'axios';


class Groups extends Component {

    constructor(props) {
        super(props);
        this.usersComponent = React.createRef();
        this.individualChatUsersComponent = React.createRef();
    }

    state = {
        groups: [],
        publicGroup: {
            groupId: null,
            name: "Public group"
        },
        groupId: null,
        name: "Public group",
        newGroupName: "",
        newGroupUserIds: [],
        createGroupButtonDisabled: true,
        newIndividualChatUserId: "",
        createIndividualChatButtonDisabled: true,
        smallDeviceGroupsVisible: true,
        groupsHubConnection: null
    };

    showGroupsOnSmallScreen = () => {
        this.setState({
            smallDeviceGroupsVisible: true
        });
    }

    showChatOnSmallScreen = () => {
        this.setState({
            smallDeviceGroupsVisible: false
        });
    }

    showChatOnSmallScreen = () => {
        this.setState({
            smallDeviceGroupsVisible: false
        });
    }

    UpdateUserGroupLastActivityDate() {
        //updates the LastActivityDate of userGroup which the user leaves        

        if (this.state.groupId != null) {
            const { token } = this.props.userData;

            axios.post(
                window.webChatConfig.webApiAddress + '/usergroup/lastactivitydate/' + this.state.groupId,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + token
                    }
                });
        }
    }

    selectGroup = (group) => {
        this.UpdateUserGroupLastActivityDate();
        if (group.id == null) {
            this.setState({
                name: group.name,
                groupId: group.id
            });
        }
        else {
            let index = this.state.groups.findIndex((currentGroup) => currentGroup.id === group.id)
            let updatedGroups = [...this.state.groups];

            updatedGroups[index].unreadMessagesCount = 0;
            this.setState({
                name: group.name,
                groupId: group.id,
                groups: updatedGroups
            });
        }
        this.showChatOnSmallScreen();

    }

    sendMessageAllert = () => {
        let orderedGroupsByDate = this.RearangeGroupsByLastUpdate();
    }

    RearangeGroupsByLastUpdate = () => {
        let updatedGroups = [...this.state.groups];
        let latestActivityGroupId = updatedGroups.findIndex(g => g.id === this.state.groupId);
        if (latestActivityGroupId != 0) {
            let group = updatedGroups.splice(latestActivityGroupId, 1);
            updatedGroups = [group[0], ...updatedGroups];
            this.setState({
                groups: updatedGroups
            })
        }
    }

    componentDidMount() {

        const { userId, userName, token } = this.props.userData;

        let groupsHubConnection = new signalR.HubConnectionBuilder()
            .withUrl(window.webChatConfig.signalRHubAddress, {
                accessTokenFactory: () => token
            })
            .configureLogging(signalR.LogLevel.Debug)
            .build();

        fetch(window.webChatConfig.webApiAddress + "/groups", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(result => {
                this.setState({
                    groups: result
                });
            })
            .then(() => {
                this.setState({ groupsHubConnection },
                    () => {
                        this.state.groupsHubConnection.start()
                            .then(() => {
                                this.state.groups.forEach(function (group) {
                                    groupsHubConnection.invoke("JoinToGroup", group.id)
                                        .catch(function (err) {
                                            return console.error(err.toString());
                                        });
                                });

                                groupsHubConnection.on("ReceiveGroupMessage", (message) => {
                                    let updatedGroups = [...this.state.groups];
                                    const group = updatedGroups.find((group) => message.groupId === group.id);
                                    if (group.id != this.state.groupId) {
                                        group.unreadMessagesCount++;
                                        this.setState({ groups: updatedGroups });
                                    }
                                });
                            });
                        this.setState({ groupsHubConnection });
                    })
            });
    }

    selectedGroupUsersChanged = (selectedUsers) => {
        const buttonDisabled = selectedUsers.length < 2;
        this.setState({
            newGroupUserIds: selectedUsers.map(u => u.id),
            createGroupButtonDisabled: buttonDisabled
        });
    }

    selectedIndividualChatUsersChanged = (selectedUsers) => {
        if (!selectedUsers.length) {
            this.setState({
                newIndividualChatUserId: [],
                createIndividualChatButtonDisabled: true
            });
        } else {
            this.setState({
                newIndividualChatUserId: selectedUsers[0].id,
                createIndividualChatButtonDisabled: false
            });
        }
    }

    createGroup = () => {
        const name = this.state.newGroupName;
        const userIds = this.state.newGroupUserIds;

        this.sendCreateGroupRequest(name, userIds);

        this.setState({ newGroupName: '' });
        this.usersComponent.current.reset();
    }

    createIndividualChat = () => {
        const name = null;
        const userIds = [this.state.newIndividualChatUserId];

        this.sendCreateGroupRequest(name, userIds);

        this.individualChatUsersComponent.current.reset();
    }

    sendCreateGroupRequest = (name, userIds) => {
        const { token } = this.props.userData;
        fetch(window.webChatConfig.webApiAddress + '/groups/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ name, userIds }),
        })
            .then(res => res.json())
            .then(result => {
                if (this.state.groups.find(g => g.id == result.id)) {
                    this.selectGroup(result);
                } else {
                    this.setState({
                        groups: [result, ...this.state.groups]
                    },
                        () => {
                            this.selectGroup(result);
                        });
                }
            });
    }


    render() {
        const { groups, name, groupId, publicGroup, newGroupName } = this.state;
        return (
            <div>
                <div className="row no-gutters">
                    <div className={("col-12 col-lg-3" + (this.state.smallDeviceGroupsVisible ? "" : " d-none d-lg-block"))}>
                        <div className="container">
                            <div className="d-flex">
                                <div className="flex-grow-1"><h5>Chats</h5></div>
                                <div>
                                    <div class="btn-group" role="group">
                                        <button type="button" className="btn btn-outline-secondary btn-sm"
                                            data-toggle="modal" data-target="#createNewIndividualChat" title="Create new individual chat">
                                            <i class="fas fa-user-friends"></i>
                                        </button>
                                        <button type="button" className="btn btn-outline-secondary btn-sm float-right"
                                            data-toggle="modal" data-target="#createNewGroup" title="Create new group">
                                            <i class="fas fa-users"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="list-group" style={{ "height": "calc(100vh - 96px)", "overflow-y": "auto" }}>
                                <a href="#" class={"list-group-item list-group-item-action" + (!this.state.groupId ? " active" : "")}
                                    onClick={() => this.selectGroup(publicGroup)}>
                                    Public group
                                 </a>
                                {groups.map((group) => (

                                    <a href="#" class={"list-group-item list-group-item-action" + (this.state.groupId === group.id ? " active" : "")}
                                        key={group.id}

                                        onClick={() => this.selectGroup(group)}>
                                        {group.name}
                                        <span class={"badge badge-danger badge-pill ml-2 " + (group.unreadMessagesCount > 0 ? "d-inline-block" : "d-none")}
                                            style={{ "font-size": "45%" }}>{group.unreadMessagesCount}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className={("col-12 col-lg-9" + (!this.state.smallDeviceGroupsVisible ? "" : " d-none d-lg-block"))}>
                        <Chat key={this.state.groupId}
                            userData={this.props.userData}
                            groupId={this.state.groupId}
                            name={this.state.name}
                            sendMessageAllert={this.sendMessageAllert}
                            showGroupsOnSmallScreen={this.showGroupsOnSmallScreen}>
                        </Chat>
                    </div>
                </div>

                <div class="modal fade" id="createNewGroup" tabindex="-1" role="dialog" aria-labelledby="createNewGroupLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="createNewGroupLabel">Create Group</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <input type="text" placeholder="Group name" class="form-control mb-2"
                                    value={newGroupName} onChange={e => this.setState({ newGroupName: e.target.value })}>
                                </input>
                                <Users ref={this.usersComponent}
                                    userData={this.props.userData}
                                    selectedUsersChanged={this.selectedGroupUsersChanged}
                                />
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" data-dismiss="modal"
                                    disabled={this.state.createGroupButtonDisabled}
                                    title={this.state.createGroupButtonDisabled ? "Please select at least two users" : ""}
                                    onClick={this.createGroup}>Create</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="createNewIndividualChat" tabindex="-1" role="dialog" aria-labelledby="createNewIndividualChatLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="createNewIndividualChatLabel">Create Individual Chat</h5>
                                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <Users ref={this.individualChatUsersComponent}
                                    userData={this.props.userData}
                                    selectedUsersChanged={this.selectedIndividualChatUsersChanged}
                                    singleSelection={true}
                                />
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" data-dismiss="modal"
                                    disabled={this.state.createIndividualChatButtonDisabled}
                                    title={this.state.createIndividualChatButtonDisabled ? "Please select user" : ""}
                                    onClick={this.createIndividualChat}>Create</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default Groups;