import React, { Component } from "react";

class Users extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            searchUserText: "",
            selectedUsers: [],
            selectedUser: null
        };
        this.typingTimer = null;
    }

    componentDidMount() {
        this.loadUsers();
    }

    selectUser = (selectedUser) => {
        let { selectedUsers } = this.state;

        if (this.props.singleSelection) {
            selectedUsers = [];
            selectedUsers.push(selectedUser);
        } else {
            let isUserAlreadySelected = selectedUsers.some(u => u.id === selectedUser.id);
            if (!isUserAlreadySelected) {
                selectedUsers.push(selectedUser);
            } else {
                selectedUsers = selectedUsers.filter((user) => user.id !== selectedUser.id);
            }
        }

        this.setState({ selectedUsers })
        if (this.props.selectedUsersChanged) {
            this.props.selectedUsersChanged(selectedUsers);
        }

    }


    loadUsers = () => {
        const { userName, token } = this.props.userData;

        let searchUserTextStr = "";
        if (this.state.searchUserText) {
            searchUserTextStr = "&search=" + this.state.searchUserText;
        }

        fetch(`${window.webChatConfig.webApiAddress}/user/?excludeCurrent=true${searchUserTextStr}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(result => {
                this.setState({
                    // isLoaded: true,
                    users: result
                });
            }
            );
    }

    reset = () => {
        const oldSearchText = this.state.searchUserText;
        this.setState({
            searchUserText: "",
            selectedUsers: [],
            selectedUser: null
        }, () => { if (oldSearchText) this.loadUsers(); });
    }

    searchValueChanged = (event) => {
        console.log(event.key);
        this.setState({ searchUserText: event.target.value });
        clearTimeout(this.typingTimer);
        this.typingTimer = setTimeout(() => this.loadUsers(), 500);
    }

    render() {
        const { users, searchUserText, selectedUsers } = this.state;
        return (
            <div>
                <div className="d-flex mb-2">
                    <div class="flex-grow-1 mt-1 ml-1">Users</div>
                    <div class="form-inline">
                        <div class="input-group">
                            <input className="form-control form-control-sm" type="text" placeholder="Search user"
                                value={searchUserText}
                                onChange={this.searchValueChanged}
                            />
                            <div class="input-group-append">
                                <button className="btn btn-sm btn-outline-secondary"
                                    onClick={this.loadUsers}
                                    title="Search">
                                    <i class="fas fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    users.map((user) => {
                        let isUserSelected = selectedUsers.some(u => u.id === user.id);

                        return <div key={user.id} class={"list-group-item list-group-item-action" + (isUserSelected ? " active" : "")}

                            onClick={() => this.selectUser(user)}>

                            {user.userName}

                        </div>
                    })
                }
            </div >
        );
    }
}

export default Users;