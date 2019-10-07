import React from 'react'
import {Route, Redirect} from 'react-router-dom';



const withPrivateRoute = WrappedComponent => {
    class WithPrivateRoute extends React.Component {
        
        render() {
            const {loggedIn} = this.props;

            // If user is not logged in, store the location of the page they came from, so they can be redirected to it after signing in
            if (!this.props.loggedIn) {
                const prevLocation = this.props.location.pathname;
                sessionStorage.setItem('previousLocation', prevLocation);
            }

            return <Route render={() => loggedIn ? <WrappedComponent {...this.props} /> : <Redirect to="/signin" />} />;
        }
    }
    return WithPrivateRoute;
}

export default withPrivateRoute;