import React, {Component} from 'react';



class UserSignIn extends Component {

    handle_cancel = e => {
        e.preventDefault();
        this.props.history.push("/courses");
    }

    handle_submit = e => {
        e.preventDefault();
        const formData = Array.from(new FormData(e.target));
        const emailAddress = formData[0][1];
        // const emailAddress = this.query.emailAddress;
        const password = formData[1][1];
        // const password = this.query.password;
        const prevLoc = sessionStorage.getItem('previousLocation');

        this.props.sign_in(emailAddress, password);
        
        if (prevLoc) {
            setTimeout(() => {
                this.props.history.push(prevLoc);
                sessionStorage.clear();
            }, 200);
        } else {
            this.props.history.goBack();
        }
    }

    render() {
        return (
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Sign In</h1>
                    <div>
                        <form onSubmit={this.handle_submit}>
                            <div><input id="emailAddress"
                                        name="emailAddress"
                                        type="text"
                                        placeholder="Email Address"
                                        // required ref={input => this.query = {emailAddress: input}}
                            /></div>
                            <div><input id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        // required ref={input => this.query = {...this.query, password: input}}
                            /></div>
                            <div className="grid-100 pad-bottom">
                                <button className="button" type="submit">Sign In</button>
                                <button className="button button-secondary" onClick={this.handle_cancel}>Cancel</button>
                            </div>
                        </form>
                    </div>
                    <p>&nbsp;</p>
                    <p>Don't have a user account? <a href="/signup">Click here</a> to sign up!</p>
                </div>
            </div>
        );
    }
}

export default UserSignIn;