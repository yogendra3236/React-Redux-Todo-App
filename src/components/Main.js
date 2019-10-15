import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from  'react-router-dom';
import LoginPage from './LoginPage';
import Card from '../containers/Card';
import SignupPage from './SignupPage';
import ForgotPass from './ForgotPass';
import ResetPass from './ResetPass';
import Profile from '../containers/Profile';
import Todo from '../containers/Todo';

export default class Main extends Component {
    render() {
        return (
            <Router>
                <Route path="/" exact component={ LoginPage } />
                <Route path="/login" exact component={ LoginPage }/>
                <Route path="/signup" exact component={ SignupPage } />
                <Route path="/profile" exact component={ Profile } />
                <Route path="/project" exact component={ Card } />
                <Route path="/forgotpass" exact component={ ForgotPass } />
                <Route path="/resetpass" exact component={ ResetPass } />
                <Route path="/todo/:cardId" exact component={ Todo } />
            </Router>
        )
    }
}