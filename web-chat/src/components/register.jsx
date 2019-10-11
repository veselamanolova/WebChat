import React, { Component } from "react";
import { Route, Link, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'
import axios from 'axios';

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
        const RegisterCredentials =
        {
            UserName: userName,
            Email: email,
            Password: password
        }

        axios.post(
            window.webChatConfig.webApiAddress + '/user/register',
            RegisterCredentials,
            {
                headers: { 'Content-Type': 'application/json' }
            })
            .then(response => {
                if (response.data) {
                    localStorage.setItem('logedInUserData', JSON.stringify(response.data));
                    window.location.assign(window.location.origin);
                }
                else {
                    this.setState({ loginError: response.error });
                }
            }, error => {
                if (error.resonse) {
                    this.setState({ loginError: JSON.stringify(error.response) });
                    if (error.response.data) {
                        this.setState({ loginError: JSON.stringify(error.response.data) });
                    }
                }
                else {
                    this.setState({ loginError: "Register failed" });
                }
            });
    };

    keyPressed = (event) => {
        if (event.key === "Enter") {
            this.handleRegister()
        }
    }

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
                                        onKeyPress={this.keyPressed}
                                    />
                                </div>
                                <div class="form-group">
                                    <label for="email"> Email</label>
                                    <input type="text" class="form-control bg-light" id="email"
                                        value={email}
                                        onChange={e => this.setState({ email: e.target.value })}
                                        onKeyPress={this.keyPressed}
                                    />
                                </div>
                                <div class="form-group">
                                    <label for="password">Password</label>
                                    <input type="password" class="form-control bg-light" id="password"
                                        value={password}
                                        onChange={e => this.setState({ password: e.target.value })}
                                        onKeyPress={this.keyPressed}
                                    />
                                </div>
                                <div className="d-flex">
                                    <button className="btn btn-primary p-1 mt-4 flex-grow-1" onClick={
                                        this.handleRegister
                                    }>Register</button>
                                </div>
                                <div className="flex-grow-1">
                                    <div class="alert alert-danger ml-2 mb-0" role="alert"
                                        style={{
                                            paddingBottom: "6px", paddingTop: "6px",
                                            display: this.state.loginError ? 'block' : 'none'
                                        }}>
                                        {this.state.loginError}
                                    </div>
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