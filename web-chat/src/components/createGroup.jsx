import React, { Component } from "react";

class CreateGroup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            searchUserText: "",
            selectedUsers: [],
            selectedUser: null
        };
    }

    componentDidMount() {
        this.loadUsers();

    }

    selectUser = (selectedUser) => {
        const { selectedUsers } = this.state;

        let isUserAlreadySelected = selectedUsers.some(u => u.id === selectedUser.id);
        // let userIndex =  this.state.findIndex(u => u.id ===selectedUser.id);

        if (!isUserAlreadySelected) {
            selectedUsers: selectedUsers.push(selectedUser)
            this.setState({
                selectedUsers: selectedUsers
            })
        }
        else {
            this.setState({
                selectedUsers: selectedUsers.filter(function (user) {
                    return user.id !== selectedUser.id
                })
            })
        }
    }


    loadUsers = () => {
        const { userName, token } = this.props.userData;

        let searchUserTextStr = "";
        if (this.state.searchUserText) {
            searchUserTextStr = "?search=" + this.state.searchUserText;
        }

        fetch(window.webChatConfig.webApiAddress + "/user/" + searchUserTextStr, {
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



    render() {
        const { users, searchUserText, selectedUsers } = this.state;
        return (
            <div className="container">
                <div class="form-inline">
                    <input className="form-control form-control-sm" type="text" placeholder="Search user"
                        value={searchUserText} onChange={e => this.setState({ searchUserText: e.target.value })} />
                    <button className="btn btn-sm btn-outline-secondary ml-1" onClick={this.loadUsers} title="Search">
                        <i class="fas fa-search"></i>
                    </button>
                </div>

                <ul>
                    {users.map((user) => {
                        let isUserSelected = selectedUsers.some(u => u.id === user.id);

                        return <div key={user.id} class={"list-group-item list-group-item-action" + (isUserSelected ? " active" : "")}

                            onClick={() => this.selectUser(user)}>

                            {user.userName}

                        </div>
                    })}


                </ul>
            </div>
        );
    }
}

export default CreateGroup;