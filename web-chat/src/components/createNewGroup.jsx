import React, { Component } from "react";

class CreateNewGroup extends React.Component {
    constructor(props) {
        super(props);
        var localStrUserData = localStorage.getItem('logedInUserData');

        this.state = {
            users: []
        };
    }

    componentDidMount() {

        const { userName, token } = this.props.userData;

        fetch("http://localhost:5000/api/user/", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(result => {
                console.log(result);
                this.setState({
                    // isLoaded: true,
                    users: result
                });
            }
            );
    }


    render() {
        const { users } = this.state;
        return (
            <div></div>

            //     <div>
            //         <ul>
            //             {users.map((user) => (
            //                 <div key={user.id} onClick={() => this.selectUser(user)}>
            //                     <p>
            //                         {user.userName}
            //                     </p>
            //                 </div>
            //             ))}
            //         </ul>
            //     </div>


            // // <div className="container" >
            // //     <div className="form-check">
            // //         <input className="form-check-input" type="radio" name="gridRadios" id="gridRadios2" value="option2" />
            // //         <label className="form-check-label" for="gridRadios2">
            // //             Second radio
            // //         </label>
            // //     </div>

            // // </div>


            // <div className="container">
            //     <h2>Save the multiple checkbox values in React js</h2>
            //     <hr />
            //     <form onSubmit={this.onSubmit}>
            //     {users.map((user) => (
            //         <div className="form-check">
            //             <label className="form-check-label">
            //                 <input type="checkbox"
            //                     checked={this.state.isMJ}
            //                     onChange={this.toggleSelected(user)}
            //                     className="form-check-input"
            //                 />
            //                 MJ
            //              </label>
            //         </div>
            //         ))}
            //     </form>
            // </div>


        );
    }
}

export default CreateNewGroup;

