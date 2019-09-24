import React, { Component } from "react";
import { Route, Link, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom'


class Register extends React.Component {
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
                window.location.reload()
            });
    };



    render() {
        const { email, password } = this.state;
        return (
            <div>
                Register
            </div>
        );
    }
}


export default Register;