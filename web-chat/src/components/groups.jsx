import React, { Component } from "react";
import { Route, Link, BrowserRouter as Router, Switch, withRouter } from 'react-router-dom';
import Chat from "./chat";
import { createBrowserHistory } from 'history';
import UserProfile from "./userProfile";
import Users from "./users";

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
        createIndividualChatButtonDisabled: true
    };

    selectGroup = (group) => {
        this.setState({
            name: group.name,
            groupId: group.id,

        });
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
        console.log(userId);

        fetch(`http://localhost:5000/api/groups`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                this.setState({
                    // isLoaded: true,
                    groups: result
                });
            }
            );
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
        fetch('http://localhost:5000/api/groups/', {
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
                    <div className="col-3">
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
                                        key={group.id} onClick={() => this.selectGroup(group)}>
                                        {group.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-9">
                        <Chat key={this.state.groupId}
                            userData={this.props.userData}
                            groupId={this.state.groupId}
                            name={this.state.name}
                            sendMessageAllert={this.sendMessageAllert}>
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