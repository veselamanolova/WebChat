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
        // selectGroup: this.selectGroup(group)
    };

    selectGroup = (group) => {
        console.log("State before" + this.state.groupId + this.state.name);
        console.log("group selected" + group.id + group.name);
        this.setState({
            name: group.name,
            groupId: group.id
        });
        console.log("State after" + this.state.groupId + this.state.name);
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
        const { groups, name, groupId, publicGroup } = this.state;
        return (

            < div >
                <div className="row">
                    <Router>
                        <div className="xs-col-2 md-col-2">
                            <div fixed-top>
                                <div className="lead font-weight-bold">Groups and Chats </div>
                            </div>
                            <ul>
                                {/* <div key={null} onClick={() => this.selectGroup(publicGroup)}>
                                    <p>
                                        {<Link to={{ pathname: `/groups/` }}>{"Public group"}</Link>}
                                    </p>
                                </div> */}
                                {groups.map((group) => (

                                    <div key={group.id} onClick={() => this.selectGroup(group)}>
                                        <p>
                                            {<Link to={{ pathname: `/groups/${group.id}` }}>{group.name}</Link>}
                                        </p>
                                    </div>
                                ))}
                            </ul>
                        </div>
                        <Switch>
                            <Route exact path="/groups/" component={() => <Chat userData={this.props.userData}
                                groupId={null}
                                name={"Public group"} />} />
                            <Route path="/groups/:groupId" component={() => <Chat userData={this.props.userData}
                                groupId={this.state.groupId}
                                name={this.state.name} />} />
                        </Switch>
                    </Router>
                </div>
            </div >
        );
    }
}

export default Groups;