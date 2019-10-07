import React, {Component} from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';

import Header from './components/Header.js';

import Courses from './components/Courses.js';
import CourseDetail from './components/CourseDetail.js';
import UpdateCourse from './components/UpdateCourse.js';
import CreateCourse from './components/CreateCourse.js';

import UserSignIn from './components/UserSignIn.js';
import UserSignUp from './components/UserSignUp.js';
import UserSignOut from './components/UserSignOut.js';

import UnhandledError from './components/errors/UnhandledError.js';
import NotFound from './components/errors/NotFound.js';
import Forbidden from './components/errors/Forbidden.js';



class App extends Component {
    constructor() {
        super();
        this.state = {
            loggedIn: false,
            currentUser: {}
        };
    }

    componentDidMount = () => {
        this.if_user_load_user();
    }

    sign_in = (userName, password) => {
        const _64encoded_userAndPass = window.btoa(`${userName}:${password}`);

        const myHeader = new Headers({
            withCredentials: true,
            Authorization: "Basic " + _64encoded_userAndPass
        });

        const myRequest = new Request("http://localhost:5000/api/users", {
            method: "GET",
            headers: myHeader
        });

        fetch(myRequest)
            .then(res => {
                console.log(res.status);
                if (res.status === 200) {
                    if (!document.cookie) {
                        // set cookie
                        document.cookie = `user=${userName},${password}`;
                    }

                    return res.json().then(res => {
                                res.password = password;
                                this.setState({loggedIn: true, currentUser: res});
                    });
                } else if (res.status === 500) {
                    window.location.pathname = "/error";
                    let err = new Error();

                    err.name = "Internal Server Error";
                    err.message = "Status Code: 500";
                    throw err;
                } else {
                    let err = new Error();

                    err.message = res.message;
                    throw err;
                }
            })
            .catch (err => {
                console.log(err);
            });
    }

    sign_out = () => {
        this.setState({loggedIn: false, currentUser: {}});
    }

    if_user_load_user = () => {
        const cookie = document.cookie.replace('user=', '');

        if (cookie) {
            let [userName, password] = cookie.split(',');

            this.sign_in(userName, password);
        }
    }


    render() {
        // clear any previous session "cookies"
        sessionStorage.clear();
        return (
            <div>
                <BrowserRouter>
                    <Header loggedIn={this.state.loggedIn} currentUser={this.state.currentUser} />
                    <Switch>
                        <Route exact path="/courses" render={() => <Redirect to="/" />} />
                        <Route exact path="/" component={Courses} />
                        <Route exact path="/courses/create"
                            render={ routeProp => <CreateCourse {...this.state} {...routeProp} />} />
                        <Route exact path="/courses/:course_id/update"
                            render={ routeProp => <UpdateCourse {...this.state} {...routeProp} />} />
                        <Route exact path="/courses/:course_id"
                            render={ routeProp => <CourseDetail {...this.state} {...routeProp} />} />

                        <Route path="/signin" render={ routeProps => this.state.loggedIn ? <Redirect to="/courses" /> : <UserSignIn {...routeProps} sign_in={this.sign_in} />} />
                        <Route path="/signup" render={ routeProps => <UserSignUp {...routeProps} sign_in={this.sign_in} />} />
                        <Route path="/signout" render={ routeProps => <UserSignOut {...routeProps} sign_out={this.sign_out} />} />

                        <Route path="/error" component={UnhandledError} />
                        <Route path="/forbidden" component={Forbidden} />
                        <Route path="/notfound" component={NotFound} />
                        <Route component={NotFound} />
                    </Switch>
                </BrowserRouter>
            </div>
        );
  }
}

export default App;
