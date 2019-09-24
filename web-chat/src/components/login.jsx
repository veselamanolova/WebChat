import React, { Component } from "react";
import { Route, Link, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'
import { withRouter } from "react-router-dom";;


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
            token: '',
            LoginError: ''
        };
    }

    componentDidMount() {
    }

    sendLoginCredentials = () => {
        console.log(this.state.email + " " + this.state.password)
        debugger;

        fetch('http://localhost:5000/api/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password
            }),
        })
            .then(res => res.json())
            .then(result => {
                console.log(`result: ${result}`);

                localStorage.setItem('logedInUserData', JSON.stringify(result));
                window.location.assign(window.location.origin);
            });
    };


    // NavigateToRegister = () => {
    //     this.props.history.push("register");
    // }

    render() {
        const { email, password } = this.state;
        return (
            <div>
                <div className="row">
                    <div className="container col-sm-12 col-md-4 m-10">
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
                                    <button className="btn btn-primary p-1 mt-4 flex-grow-1" onClick={
                                        this.sendLoginCredentials
                                    }>Login</button>
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
        );
    }
}


export default Login;