import React, { Component } from "react";
import { Route, Link, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'
import { withRouter } from "react-router-dom";
import axios from 'axios';


class Login extends React.Component {
    constructor(props) {
        super(props);
        var localStrUserData = localStorage.getItem('logedInUserData');
        this.state = {
            email: '',
            userId: '',
            password: '',
            userName: '',
            token: '',
            loginError: ''
        };
    }

    componentDidMount() {
    }

    sendLoginCredentials = () => {
        const loginCredentials = {
            email: this.state.email,
            password: this.state.password
        }
        axios.post(
            window.webChatConfig.webApiAddress + '/user/login',
            loginCredentials,
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
                    this.setState({ loginError: error.response.data });
                }
                else {
                    this.setState({ loginError: "Login error" });
                }
            });
    }

    render() {
        const { email, password } = this.state;
        return (
            <div>
                <div className="row">
                    <div className="container col-sm-12 col-lg-4 m-10">
                        <h3 className="mt-5 mb-4 text-center" >Welcome to WebChat</h3>
                        <div class="card">
                            <div class="card-body">
                                <div class="form-group">
                                    <label for="email"> Email</label>
                                    <input type="text" class="form-control bg-light" id="email" placeholder="email"
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
                                    <button className="btn btn-primary p-1 mt-4 flex-grow-1"

                                        onClick={
                                            this.sendLoginCredentials
                                        }

                                    >Login</button>
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
                            <div class="card mt-4">
                                <div class="card-body">
                                    New to WebChat? <a href="/register">Create an account</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default Login;