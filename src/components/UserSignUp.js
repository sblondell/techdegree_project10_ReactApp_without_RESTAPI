import React, {Component} from 'react';



class UserSignUp extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            allValid: true,
            pendingNewUser: {
                "firstName": "",
                "lastName": "",
                "emailAddress": "",
                "password": "",
                "confirmPassword": ""
            }
        }
    }
    
    handle_cancel = e => {
        e.preventDefault();
		this.props.history.push("/courses");
    }

    handle_submit = e => {
        e.preventDefault();
        
        const formData = Array.from(new FormData(e.target));
        let allowSubmit = true;
        const firstName = formData[0][1];
        const lastName = formData[1][1];
        const emailAddress = formData[2][1];
        const password = formData[3][1];
        const confirmPassword = formData[4][1];


        const newUser = {
            firstName,
            lastName,
            emailAddress,
            password,
            confirmPassword
        }

        // If any sign up values are empty or invalid email address, do not submit form
        if (!firstName || !lastName || !emailAddress || !password || !confirmPassword 
            || !(/^[0-9a-z]+@[0-9a-z]+\.[a-z]{3}$/i.test(emailAddress))) {
            allowSubmit = false;
            this.setState({ pendingNewUser: newUser, allValid: allowSubmit});
            return null;
        }

        // If passwords don't match, do not submit form
        if (password !== confirmPassword) {
            allowSubmit = false;
            this.setState({ pendingNewUser: newUser, allValid: allowSubmit});
            return null;
        }


        const myHeader = new Headers({
            "Content-Type": "application/json"
        });

        const myRequest = new Request("http://localhost:5000/api/users", {
            method: "POST",
            headers: myHeader,
            body: JSON.stringify(newUser)
        });

        fetch(myRequest)
            .then(res => {
                if (res.status === 200) {
                    this.props.sign_in(newUser.emailAddress, newUser.password);
		            this.props.history.push("/courses");
                } else if (res.status === 500) {
                    this.props.history.push("/error");
                    let err = new Error();

                    err.name = "Internal Server Error";
                    err.message = "Status Code: 500";
                    throw err;
                } else {
                    this.props.history.push("/signup");
                    let err = new Error();

                    err.message = res.message;
                    throw err;
                }
            }).catch(err => {
                console.error("There was a problem: " + err);
            });
    }

    /*
     * Generates a presentable string in the form of "firstName" ==> "First Name".
     * @params  {String}    name - the name of the string to be formatted
     * @return  {String}    presentableString - the formatted string
    */
    make_string_presentable = name => {
        // Inserting a " "(space) character inbetween the 'name' value
        // "firstName" ==> "first Name"
        let presentableString = name;

        for (let char of name) {
            if (/[A-Z]/.test(char)){
                let index = name.indexOf(char);
                presentableString = name.substring(0, index) + " " + name.substring(index);
            }
        }
        // Capitalizing the first character
        presentableString = presentableString[0].toUpperCase() + presentableString.substring(1);

        return presentableString;
    }

    /*
     * Generates a custom JSX <input> element.
     * @params  {String}    name - the name associated with the input element
     * @params  {String}    type - the type associated with the input element
     * @return  {Object}    direct-return - a JSX <input> element
    */
    input_JSX_Element = (name, type) => {
        return <input
                    id={name}
                    name={name}
                    type={type}
                    placeholder={this.make_string_presentable(name)}
                    />
    }

    /*
     * Generates custom validation error messages to be displayed for the client.
     * @params  {Object}    formObject - the data object needing validation
     * @return  {Array}     customValidationMessages - an array of JSX <li> elements holding all validation error messages
    */
    generate_validation_errors = (formObject) => {
        let customValidationMessages = [];
        let uniqueIndexKey = 0;
        const pendingUserKeys = Object.keys(formObject);

        // Required fields not filled in...
        if (!this.state.allValid) {
            pendingUserKeys.forEach(key => {
                let inputName = formObject[key];

                // "confirmPassword" is a special case handled below
                if (inputName === "" && key !== "confirmPassword") {
                    customValidationMessages.push(<li key={uniqueIndexKey}>{this.make_string_presentable(key)} is required.</li>);
                    uniqueIndexKey += 1;
                }
            });

            // Passwords do not match...
            if (formObject.password !== formObject.confirmPassword)
                customValidationMessages.push(<li key={uniqueIndexKey}>Passwords do not match.</li>);
            // Invalid email address...
            if(!(/^[0-9a-z]+@[0-9a-z]+\.[a-z]{3}$/i.test(formObject.emailAddress)))
                customValidationMessages.push(<li key={uniqueIndexKey+1}>Invalid Email Address.</li>);
        }

        return customValidationMessages;
    }

    render() {
        return (
            <div className="bounds">
                <div className="grid-33 centered signin">
                    <h1>Sign Up</h1>
                    <div>
                        <div>
                            <div className="validation-errors">
                                <ul>
                                    {this.generate_validation_errors(this.state.pendingNewUser)}
                                </ul>
                            </div>
                        </div>
                        <form action="/courses" onSubmit={this.handle_submit}>
                            <div>{this.input_JSX_Element("firstName", "text")}</div>
                            <div>{this.input_JSX_Element("lastName", "text")}</div>
                            <div>{this.input_JSX_Element("emailAddress", "text")}</div>
                            <div>{this.input_JSX_Element("password", "password")}</div>
                            <div>{this.input_JSX_Element("confirmPassword", "password")}</div>
                            <div className="grid-100 pad-bottom">
                                <button className="button" type="submit">Sign Up</button>
                                <button className="button button-secondary" onClick={this.handle_cancel}>Cancel</button>
                            </div>
                        </form>
                    </div>
                    <p>&nbsp;</p>
                    <p>Already have a user account? <a href="/signin">Click here</a> to sign in!</p>
                </div>
            </div>
        );
    }
}

export default UserSignUp;