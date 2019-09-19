import React, { Component } from "react";

class CreateNewGroup extends React.Component {
    constructor(props) {
        super(props);
        var localStrUserData = localStorage.getItem('logedInUserData');

        this.state = {
        };
    }

    componentDidMount() {
    }


    render() {
        const { email, password } = this.state;
        return (
            <select class="custom-select" data-live-search="true" >
                <option data-tokens="ketchup mustard">Hot Dog, Fries and a Soda</option>
                <option data-tokens="mustard">Burger, Shake and a Smile</option>
                <option data-tokens="frosting">Sugar, Spice and all things nice</option>
            </select>
        );
    }
}

export default CreateNewGroup;

