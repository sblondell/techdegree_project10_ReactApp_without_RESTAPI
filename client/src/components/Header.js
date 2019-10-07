import React from 'react';
import {NavLink} from 'react-router-dom';


const Header = props => {
    function is_user_logged_in () {
        if (props.loggedIn) {
            return (
                <nav>
                    <span>Welcome, {props.currentUser.firstName + " " + props.currentUser.lastName}!</span>
                    <NavLink className="signout" to='/signout'>Sign Out</NavLink>
                </nav>
            );
        } else {
            return (
                <nav>
                    <NavLink className="signup" to='/signup'>Sign Up</NavLink>
                    <NavLink className="signin" to='/signin'>Sign In</NavLink>
                </nav>
            );
        }
    }  

    return (
        <div className="header">
            <div className="bounds">
                <h1 className="header--logo"><NavLink to='/'>Courses</NavLink></h1>
                {is_user_logged_in()}
            </div>
        </div>
    );
}

export default Header;