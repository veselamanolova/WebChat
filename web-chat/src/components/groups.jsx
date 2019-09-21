import React, { Component } from "react";
import { Route, Link, BrowserRouter as Router, Switch, withRouter } from 'react-router-dom';
import Chat from "./chat";
import { createBrowserHistory } from 'history';

class Groups extends Component {

    constructor(props) {
        super(props);
        // this.state = {
        //     groups: [],
        //     groupId: null,
        //     name: "Public group",
        //     // selectGroup: this.selectGroup(group)
        // };
    }

    state = {
        groups: [],
        publicGroup: {
            groupId: null,
            name: "Public group"
        },
        groupId: null,
        name: "Public group",
        newGroupName: ""
    };

    selectGroup = (group) => {
        this.setState({
            name: group.name,
            groupId: group.id,

        });
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

    createGroup = () => {

        const { token } = this.props.userData;

        fetch('http://localhost:5000/api/groups/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                name: this.state.newGroupName
            }),
        })
            .then(res => {
                return res.json();
            })
            .then(result => {
                console.log(`result: ${result}`);


                this.setState({
                    groups: [result, ...this.state.groups]
                }, () => {
                    this.selectGroup(result);
                });

            });
        this.state.newGroupName = '';
    }

    render() {
        const { groups, name, groupId, publicGroup, newGroupName } = this.state;
        return (

            < div >
                <div className="row">
                    <div className="col-3">
                        <div className="row">
                            <div className="col-9"><h5>Groups and Chats</h5></div>
                            <div className="col-3">
                                <button type="button" className="btn btn-secondary btn-sm float-right"
                                    data-toggle="modal" data-target="#createNewGroup" title="Create new group">
                                    +
                                </button>
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
                                        <input type="text" placeholder="Group name" style={{ width: "100%" }}
                                            value={newGroupName} onChange={e => this.setState({ newGroupName: e.target.value })}>
                                        </input>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                        <button type="button" class="btn btn-primary" data-dismiss="modal"
                                            onClick={
                                                this.createGroup
                                            }>Create</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="list-group">
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
                    <div className="col-9">
                        <Chat key={this.state.groupId}
                            userData={this.props.userData}
                            groupId={this.state.groupId}
                            name={this.state.name}>}>
                        </Chat>
                    </div>
                </div>
            </div >
        );
    }
}

export default Groups;