import React, { Component } from "react";

class Login extends React.Component {
    constructor(props) {
        super(props);
        var localStrUserData = localStorage.getItem('logedInUserData');
        console.log(localStrUserData);
        this.state = {
            email: '',
            password: '',
            userName: '',
            token: ''
        };
    }

    componentDidMount() {
    }

    sendLoginCredentials = async () => {
        console.log(this.state.email + " " + this.state.password)

        await fetch('http://localhost:5000/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            }),
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                localStorage.setItem('logedInUserData', JSON.stringify(result));
                this.setState({
                    userName: result.userName,
                    token: result.token
                });
            })
            .then(this.props.history.push("/"));
    };



    render() {
        const { email, password } = this.state;
        return (
            <div>
                <div>
                    <label>
                        Email:
                        <input type="text" value={email}
                            onChange={e => this.setState({ email: e.target.value })} />
                    </label>
                </div>
                <div>
                    <label>
                        Password:
                        <input type="text" value={password}
                            onChange={e => this.setState({ password: e.target.value })} />
                    </label>
                </div>
                <button onClick={this.sendLoginCredentials}>Login</button>
            </div>
        );
    }
}

export default Login;