import React, { Component } from "react";

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            user: {
                id: '',
                userName: '',
                updateUserError: '',
                updateUserSuccess: false
            },
            password: {
                oldPassword: '',
                newPassword: '',
                repeatPassword: '',
                changePasswordError: '',
                changesPasswordSuccess: false
            }
        };
    }

    componentDidMount() {
        const { userId, token } = this.props.userData;
        this.setState({ token });
        fetch('http://localhost:5000/api/user/' + userId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            }
        }).then(res => res.json())
            .then(user => this.setState({ user }));
    }

    update = () => {
        this.setState(prevState => ({
            user: {
                ...prevState.user,
                updateUserError: '',
                updateUserSuccess: false
            }
        }));

        const { token, user } = this.state;
        if (!user.userName) {
            this.setState(prevState => ({
                user: {
                    ...prevState.user,
                    updateUserError: 'User name is required.'
                }
            }));
            return;
        }

        fetch('http://localhost:5000/api/user/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                id: user.id,
                userName: user.userName
            })
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    this.setState(prevState => ({
                        user: {
                            ...prevState.user,
                            updateUserError: '',
                            updateUserSuccess: true
                        }
                    }));
                    setTimeout(() => {
                        this.setState(prevState => ({
                            user: {
                                ...prevState.user,
                                updateUserSuccess: false
                            }
                        }));
                        this.props.updateHandler(result.userInfo);
                    }, 1500);
                } else {
                    this.setState(prevState => ({
                        user: {
                            ...prevState.user,
                            updateUserError: result.error,
                            updateUserSuccess: false
                        }
                    }));
                }
            });
    };

    changePassword = () => {
        this.setState(prevState => ({
            password: {
                ...prevState.password,
                changePasswordError: '',
                changesPasswordSuccess: false
            }
        }));

        const { oldPassword, newPassword, repeatPassword } = this.state.password;

        if (!oldPassword || !newPassword || !repeatPassword) {
            this.setState(prevState => ({
                password: {
                    ...prevState.password,
                    changePasswordError: 'All fields are required.'
                }
            }));
            return;
        }

        if (newPassword !== repeatPassword) {
            this.setState(prevState => ({
                password: {
                    ...prevState.password,
                    changePasswordError: "Passwords don't match."
                }
            }));
            return;
        }

        const { token, user } = this.state;
        fetch('http://localhost:5000/api/user/changePassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({
                userId: user.id,
                oldPassword: oldPassword,
                newPassword: newPassword
            })
        })
            .then(result => result.text())
            .then(result => {
                this.setState(prevState => ({
                    password: {
                        ...prevState.password,
                        changePasswordError: result,
                        changesPasswordSuccess: !result
                    }
                }));
                setTimeout(() => {
                    this.setState(prevState => ({
                        password: {
                            ...prevState.password,
                            changePasswordError: '',
                            changesPasswordSuccess: false
                        }
                    }));
                }, 1500);
            });
    }

    render() {
        const { user, password } = this.state;

        return (
            <div className="container" style={{ "max-width": "100%" }}>
                <h5>User info</h5>
                <div className="mb-3">
                    <div class="card">
                        <div class="card-body">
                            <div class="form-group row">
                                <label for="userName" class="col-sm-3 col-form-label">User name</label>
                                <div class="col-sm-9">
                                    <input type="text" class="form-control-plaintext" id="userName"
                                        value={user.userName} onChange={e => {
                                            user.userName = e.target.value;
                                            this.setState({ user });
                                        }} />
                                </div>
                            </div>


                            <div className="d-flex">
                                <div>
                                    <button class="btn btn-primary" onClick={this.update}>Update</button>
                                </div>
                                <div className="flex-grow-1">
                                    <div class="alert alert-danger ml-2 mb-0" role="alert"
                                        style={{
                                            paddingBottom: "6px", paddingTop: "6px",
                                            display: this.state.user.updateUserError ? 'block' : 'none'
                                        }}>
                                        {this.state.user.updateUserError}
                                    </div>
                                    <div class="alert alert-success ml-2 mb-0" role="alert"
                                        style={{
                                            paddingBottom: "6px", paddingTop: "6px",
                                            display: this.state.user.updateUserSuccess ? 'block' : 'none'
                                        }}>
                                        Profile data updated successfully.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p>
                    <a class="btn btn-link" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
                        Change password
                    </a>
                </p>
                <div class="collapse" id="collapseExample">
                    <div class="card">
                        <div class="card-body">
                            <div class="form-group row">
                                <label for="oldPassword" class="col-sm-3 col-form-label">Old password</label>
                                <div class="col-sm-9">
                                    <input type="password" class="form-control-plaintext" id="oldPassword"
                                        value={password.oldPassword} onChange={e => {
                                            password.oldPassword = e.target.value;
                                            this.setState({ password });
                                        }} />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="newPassword" class="col-sm-3 col-form-label">New password</label>
                                <div class="col-sm-9">
                                    <input type="password" class="form-control-plaintext" id="newPassword"
                                        value={password.newPassword} onChange={e => {
                                            password.newPassword = e.target.value;
                                            this.setState({ password });
                                        }} />
                                </div>
                            </div>
                            <div class="form-group row">
                                <label for="repeatPassword" class="col-sm-3 col-form-label">Repeat password</label>
                                <div class="col-sm-9">
                                    <input type="password" class="form-control-plaintext" id="repeatPassword"
                                        value={password.repeatPassword} onChange={e => {
                                            password.repeatPassword = e.target.value;
                                            this.setState({ password });
                                        }} />
                                </div>
                            </div>

                            <div className="d-flex">
                                <div>
                                    <button class="btn btn-primary" onClick={this.changePassword}>Save</button>
                                </div>
                                <div className="flex-grow-1">
                                    <div class="alert alert-danger ml-2 mb-0" role="alert"
                                        style={{
                                            paddingBottom: "6px", paddingTop: "6px",
                                            display: this.state.password.changePasswordError ? 'block' : 'none'
                                        }}>
                                        {this.state.password.changePasswordError}
                                    </div>
                                    <div class="alert alert-success ml-2 mb-0" role="alert"
                                        style={{
                                            paddingBottom: "6px", paddingTop: "6px",
                                            display: this.state.password.changesPasswordSuccess ? 'block' : 'none'
                                        }}>
                                        Password changed successfully.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default UserProfile;