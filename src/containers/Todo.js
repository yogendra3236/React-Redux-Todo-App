import React, { Component } from "react";
import Todolist from "./Todolist";
import Addtodo from "./AddTodo";
import Stats from "./Stats";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";
import { Redirect } from "react-router-dom";
import { getJwt } from "../components/helpers/jwt";

export default class Todo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            login: false,
            redirectToProject: false,
            clickedCardIndex: this.props.match.params.cardId,
            avatar: ""
        };
    }

    componentDidMount() {
        // console.log('componentDidUpdate')
        axios
            .get("http://localhost:4000/get", {
                params: {
                    token: getJwt(),
                    clickedCardIndex: this.state.clickedCardIndex
                }
            })
            .then(result => {
                // console.log("willupdate", result);
                this.setState({
                    avatar: result.data.avatar
                });

                if (result.data === "token is not valid") {
                    reactLocalStorage.remove("jwt", "");
                    this.setState({
                        login: true
                    });
                }
            })
            .catch(err => console.log(err));
    }

    logout = () => {
        reactLocalStorage.remove("jwt");
        this.setState({
            login: true
        });
    };

    render() {
        if (this.state.login) {
            return <Redirect to="/login" />;
        }
        if (this.state.redirectToProject) {
            return <Redirect to="/project" />;
        }
        // console.log(this.state.avatar);

        return (
            <div>
                <Stats logout={this.logout} avatar={this.state.avatar} />

                <Addtodo clickedCard={this.state.clickedCardIndex} />

                <Todolist clickedCard={this.state.clickedCardIndex} />
            </div>
        );
    }
}