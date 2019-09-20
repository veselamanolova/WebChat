import React, { Component } from "react";

class Users extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: []
        };
    }

    componentDidMount() {

        const { userName, token } = this.props.userData;

        fetch("http://localhost:5000/api/user/", {
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
                    users: result
                });
            }
            );
    }


    render() {
        const { users } = this.state;
        return (
            <div>
                <ul>
                    {users.map((user) => (
                        <div key={user.id}>
                            <p>
                                {user.userName}
                            </p>
                        </div>
                    ))}
                </ul>
            </div>
        );
    }
}

export default Users;