import React, { Component } from "react";

class Login extends React.Component {
    constructor(props) {
        super(props);
        var localStrUserData = localStorage.getItem('logedInUserData');
        console.log(localStrUserData);
        this.state = {
            email: '',
            userId: '',
            password: '',
            userName: '',
            token: ''
        };
    }

    componentDidMount() {
    }

    sendLoginCredentials = () => {
        console.log(this.state.email + " " + this.state.password)

        fetch('http://localhost:5000/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            }),
        })
            .then(res => {
                return res.json();
            }
            )
            .then(result => {
                console.log(`result: ${result}`);

                localStorage.setItem('logedInUserData', JSON.stringify(result));
                this.setState({
                    userId: result.userId,
                    userName: result.userName,
                    token: result.token
                });
            })
            .then(window.location.reload());
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
                <button onClick={
                    this.sendLoginCredentials
                }>Login</button>
            </div>
        );
    }
}

export default Login;