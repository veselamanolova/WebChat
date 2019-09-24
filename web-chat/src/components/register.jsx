import React, { Component } from "react";
import { Route, Link, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'


class Register extends React.Component {
    constructor(props) {
        super(props);
        var localStrUserData = localStorage.getItem('logedInUserData');
        console.log(localStrUserData);
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
        console.log(this.state.email + " " + this.state.password)
        debugger;

        fetch('http://localhost:5000/api/user/register', {
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
                window.location.reload()
            });
    };


    render() {
        const { userName, email, password } = this.state;
        return (
            <div>
                <div className="row">
                    <div className="container col-sm-12 col-md-4 m-10">
                        <h3 className="mt-5 mb-4 text-center" >Register to WebChat</h3>
                        <div class="card">
                            <div class="card-body">
                                <div class="form-group">
                                    <label for="userName"> Email</label>
                                    <input type="userName" class="form-control bg-light" id="userName" placeholder="name"
                                        value={userName}
                                        onChange={e => this.setState({ userName: e.target.value })}
                                    />
                                </div>
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
                                    <button className="btn btn-success p-1 mt-4 flex-grow-1" onClick={
                                        this.handleRegister
                                    }>Login</button>
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