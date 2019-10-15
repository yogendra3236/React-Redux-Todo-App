import React from "react";
import AddTodo from "./containers/AddTodo";
import Todolist from "./containers/Todolist";
import Stats from "./containers/Stats";
// import {connect} from 'react-redux';

class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Stats />
                <AddTodo />
                <Todolist />
            </React.Fragment>
        );
    }
}

export default App;
