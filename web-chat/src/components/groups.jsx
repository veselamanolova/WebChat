import React, { Component } from "react";
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom'
import Chat from "./chat";

class Groups extends Component {

    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            groupId: null
        };
    }

    componentDidMount() {

        const { userId, userName, token } = this.props.userData;
        console.log(userId);

        fetch(`http://localhost:5000/api/groups/${userId}`, {
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


    render() {
        const { groups } = this.state;
        return (
            <div>
                <div class="row">
                    <div class="col-2">
                        <ul>
                            {groups.map((group) => (
                                <div key={group.id}>
                                    <p>
                                        {group.name}
                                    </p>
                                </div>
                            ))}
                        </ul>
                    </div>
                    <div class="col-10">
                        <div>
                            <Chat
                                userData={this.props.userData}
                                groupId={this.state.groupId}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Groups;