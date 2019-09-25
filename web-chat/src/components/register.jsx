import React, { Component } from "react";
import { Route, Link, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'


class Register extends React.Component {
    constructor(props) {
        super(props);
        var localStrUserData = localStorage.getItem('logedInUserData');
        this.state = {
            email: '',
            userName: '',
            password: '',
            repeatPassword: '',
            LoginError: '',
            token: '',
            userId: ''
        };
    }

    componentDidMount() {
    }

    handleRegister = () => {
        const { userName, email, password } = this.state;

        fetch(window.webChatConfig.webApiAddress + '/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userName,
                email,
                password
            }),
        })
            .then(res => res.json())
            .then(result => {
                localStorage.setItem('logedInUserData', JSON.stringify(result));
                window.location.assign(window.location.origin);
            });
    };


    render() {
        const { userName, email, password } = this.state;
        return (
            <div>
                <div className="row">
                    <div className="container col-sm-12 col-lg-4 m-10">
                        <h3 className="mt-5 mb-4 text-center" >Register to WebChat</h3>
                        <div class="card">
                            <div class="card-body">
                                <div class="form-group">
                                    <label for="userName">Name</label>
                                    <input type="userName" class="form-control bg-light" id="userName"
                                        value={userName}
                                        onChange={e => this.setState({ userName: e.target.value })}
                                    />
                                </div>
                                <div class="form-group">
                                    <label for="email"> Email</label>
                                    <input type="text" class="form-control bg-light" id="email"
                                        value={email}
                                        onChange={e => this.setState({ email: e.target.value })}
                                    />
                                </div>
                                <div class="form-group">
                                    <label for="password">Password</label>
                                    <input type="password" class="form-control bg-light" id="password"
                                        value={password}
                                        onChange={e => this.setState({ password: e.target.value })}
                                    />
                                </div>
                                <div className="d-flex">
                                    <button className="btn btn-primary p-1 mt-4 flex-grow-1" onClick={
                                        this.handleRegister
                                    }>Register</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Register;