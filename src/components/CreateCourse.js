import React, { Component } from 'react';

import withPrivateRoute from '../HOC/withPrivateRoute.js';



class CreateCourse extends Component {
    constructor() {
        super();
    
        this.state = {
            allValid: true,
            courseDetails: {
                course: {
                    "title": "",
                    "description": "",
                    "estimatedTime": "",
                    "materialsNeeded": ""
                }
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

        const title = formData[0][1];
        const description = formData[1][1];
        const estimatedTime = formData[2][1];
        const materialsNeeded = formData[3][1];

        // // old version of program where "materials needed" was processed as an array...
        // const emptyLinesRemoved_materials = formData[3][1].split("\n")
        //                                                   .filter(material => /[A-Z0-9]+/i.test(material)) // Remove all empty values
        //                                                   .join('\n');
                                                          
        const newCourseDetails = {
            course: {
                title,
                description ,
                estimatedTime,
                // "materialsNeeded": emptyLinesRemoved_materials
                materialsNeeded
            }
        }

        // if (!title || !description || !estimatedTime || !emptyLinesRemoved_materials) {
        if (!title || !description || !estimatedTime || !materialsNeeded) {
            allowSubmit = false;
            this.setState({ courseDetails: newCourseDetails, allValid: allowSubmit});
            return null;
        }

        this.create_course(newCourseDetails.course);

        // Had to set a timer, page was redirecting too fast and not allowing user to see their course displayed on the landing page...
        setTimeout(() => {
            this.props.history.push("/courses");
        }, 500);
    }

    create_course = course => {
        const userName = this.props.currentUser.emailAddress;
        const password = this.props.currentUser.password;
        const _64encoded_userAndPass = window.btoa(`${userName}:${password}`);

        const myHeader = new Headers({
            withCredentials: true,
            Authorization: "Basic " + _64encoded_userAndPass,
            "Content-Type": "application/json"
        });

        const myRequest = new Request(`http://localhost:5000/api/courses`, {
            method: 'POST',
            headers: myHeader,
            body: JSON.stringify(course)
        });

        fetch(myRequest)
            .then(res => {
                if (res.status === 500) {
                    this.props.history.push("/error");
                    let err = new Error();

                    err.name = "Internal Server Error";
                    err.message = "Status Code: 500";
                    throw err;
                } else {
                    this.props.history.push("/courses");
                }
            })
            .catch(err => console.error("There was a problem: " + err));
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
     * Generates custom validation error messages to be displayed for the client.
     * @params  {Object}    formObject - the data object needing validation
     * @return  {Array}     customValidationMessages - an array of JSX <li> elements holding all validation error messages
    */
    generate_validation_errors = formObject => {
        let customValidationMessages = [];
        let uniqueIndexKey = 0;
        const pendingUserKeys = Object.keys(formObject);

        if (!this.state.allValid) {
            // Generate "input required" validation messages
            pendingUserKeys.forEach(key => {
                let inputName = formObject[key];

                // "confirmPassword" is a special case handled below
                if (inputName === "" && key !== "confirmPassword") {
                    customValidationMessages.push(<li key={uniqueIndexKey}>{this.make_string_presentable(key)} is required.</li>);
                    uniqueIndexKey += 1;
                }
            });
        }

        return customValidationMessages;
    }

    render() {
        const { title, description, estimatedTime, materialsNeeded } = this.state.courseDetails;

        return (
            <div className="bounds course--detail">
                <h1>Create Course</h1>
                <div>
                    <div>
                        <div className="validation-errors">
                            <ul>
                                {this.generate_validation_errors(this.state.courseDetails.course)}
                            </ul>
                        </div>
                    </div>
                    <form onSubmit={this.handle_submit}>
                    <div className="grid-66">
                        <div className="course--header">
                            <h4 className="course--label">Course</h4>
                            <div><input id="title"
                                        name="title"
                                        type="text"
                                        className="input-title course--title--input"
                                        defaultValue={ title }
                                        placeholder="Course title..." /></div>
                            <p>By Joe Smith</p>
                        </div>
                        <div className="course--description">
                            <div><textarea id="description"
                                        name="description"
                                        className=""
                                        defaultValue={ description }
                                        placeholder="Course description..."></textarea></div>
                        </div>
                    </div>
                    <div className="grid-25 grid-right">
                        <div className="course--stats">
                            <ul className="course--stats--list">
                                <li className="course--stats--list--item">
                                    <h4>Estimated Time</h4>
                                    <div><input id="estimatedTime"
                                                name="estimatedTime"
                                                type="text"
                                                className="course--time--input"
                                                defaultValue={ estimatedTime }
                                                placeholder="Hours" /></div>
                                </li>
                                <li className="course--stats--list--item">
                                    <h4>Materials Needed</h4>
                                    <div><textarea id="materialsNeeded"
                                                name="materialsNeeded"
                                                className=""
                                                defaultValue={ materialsNeeded }
                                                placeholder="List materials..."></textarea></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="grid-100 pad-bottom">
                        <button className="button" type="submit">Create Course</button>
                        <button className="button button-secondary" onClick={this.handle_cancel}>Cancel</button>
                    </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default withPrivateRoute(CreateCourse);