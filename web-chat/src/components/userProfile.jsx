import React, { Component } from "react";
import axios from 'axios';

class UserProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            token: '',
            user: {
                id: '',
                userName: '',
                profilePicture: '',
                updateUserError: '',
                updateUserSuccess: false
            },
            password: {
                oldPassword: '',
                newPassword: '',
                repeatPassword: '',
                changePasswordError: '',
                changesPasswordSuccess: false
            },
            selectedFile: null
        };
    }

    componentDidMount() {
        const { userId, token } = this.props.userData;
        this.setState({ token });
        fetch(window.webChatConfig.webApiAddress + '/user/' + userId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            }
        }).then(res => res.json())
            .then(
                user => {
                    debugger;
                    this.setState({ user })
                }
            );
    }

    updateUserNameKeyPressed = (event) => {
        if (event.key === "Enter") {
            this.update()
        }
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

        fetch(window.webChatConfig.webApiAddress + '/user/update', {
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
        fetch(window.webChatConfig.webApiAddress + 'user/changePassword', {
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
                if (result) {
                    this.setState(prevState => ({
                        password: {
                            ...prevState.password,
                            changePasswordError: result,
                            changesPasswordSuccess: false
                        }
                    }));
                } else {
                    this.setState(prevState => ({
                        password: {
                            ...prevState.password,
                            changePasswordError: '',
                            changesPasswordSuccess: true
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
                }
            });
    }

    changePasswordKeyPressed = (event) => {
        if (event.key === "Enter") {
            this.changePassword()
        }
    }

    pictureSelectHandler = (event) => {
        this.setState({
            selectedFile: event.target.files[0]
        })
    }

    pictureUploadHandler = () => {
        const { selectedFile } = this.state;
        const { token } = this.props.userData;
        let data = new FormData();
        data.append("imageInput", selectedFile);

        axios.post(window.webChatConfig.webApiAddress + '/user/uploadProfilePicture',
            data,
            {
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(result => {
                if (result.data.success) {
                    this.props.updateHandler(result.data.userInfo);
                    this.setState(prevState => ({
                        user: {
                            user: result.data.userInfo,
                            updateUserError: '',
                            updateUserSuccess: true
                        }

                    }));
                }
            });
    }




    render() {
        const { user, password } = this.state;

        return (
            <div className="row">
                <div className="container col-sm-12 col-lg-6" style={{ "max-width": "100%" }}>
                    <div className="m-1 row">
                        <div className="col-2">
                            {
                                (this.props.userData.profilePicturePath !== "") ?
                                    <img src={window.webChatConfig.webApiPictureAddress + this.props.userData.profilePicturePath}
                                        width="80" height="80"></img> : ""
                            }
                        </div>
                        <div className="col-8 text-center"> <h5>{user.userName}'s user profile</h5> </div>
                        <div className="col-2"></div>
                    </div>

                    <div className="mb-3">
                        <div class="card">
                            <div class="card-body">
                                <div class="form-group row">
                                    <label for="userName" class="col-sm-3  col-form-label">User name</label>
                                    <div class="col-sm-9" >
                                        <input type="text" class="form-control" id="userName"
                                            value={user.userName}
                                            onKeyPress={this.updateUserNameKeyPressed}
                                            onChange={e => {
                                                user.userName = e.target.value;
                                                this.setState({ user });
                                            }} />
                                    </div>
                                </div>

                                <div className="d-flex">
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
                                        User name updated successfully.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div className="mb-3">
                        <div class="card">
                            <div class="card-body">
                                <div class="form-group row">
                                    <div class="col-sm-9" >
                                        <input type="file" class="form-control"
                                            onChange={this.pictureSelectHandler} />
                                    </div>
                                </div>
                                <div className="d-flex">
                                    <button class="btn btn-primary" onClick={this.pictureUploadHandler}>Upload</button>
                                </div>

                                {/* <div className="flex-grow-1">
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
                                        User name updated successfully.
                                    </div>
                                </div> */}
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
                                        <input type="password" class="form-control" id="oldPassword"
                                            value={password.oldPassword} onChange={e => {
                                                password.oldPassword = e.target.value;
                                                this.setState({ password });
                                            }}
                                            onKeyPress={this.changePasswordKeyPressed} />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="newPassword" class="col-sm-3 col-form-label">New password</label>
                                    <div class="col-sm-9">
                                        <input type="password" class="form-control" id="newPassword"
                                            value={password.newPassword} onChange={e => {
                                                password.newPassword = e.target.value;
                                                this.setState({ password });
                                            }}
                                            onKeyPress={this.changePasswordKeyPressed} />
                                    </div>
                                </div>
                                <div class="form-group row">
                                    <label for="repeatPassword" class="col-sm-3 col-form-label">Repeat password</label>
                                    <div class="col-sm-9">
                                        <input type="password" class="form-control" id="repeatPassword"
                                            value={password.repeatPassword}
                                            onChange={e => {
                                                password.repeatPassword = e.target.value;
                                                this.setState({ password });
                                            }}
                                            onKeyPress={this.changePasswordKeyPressed} />
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
            </div>
        );
    }
}

export default UserProfile;