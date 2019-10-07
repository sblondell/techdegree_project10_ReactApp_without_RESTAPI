import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import ReactMarkdown from 'react-markdown';



class CourseDetail extends Component {
    constructor() {
        super();
        this.state = {
            courseDetails: {
                course: {
                    "title": "",
                    "description": "",
                    "estimatedTime": "",
                    "materialsNeeded": ""
                },
                user: {
                    "firstName": "",
                    "lastName": "",
                    "emailAddress": "",
                }
            }
        }
    }

    componentDidMount() {
        let courseId = this.props.match.params.course_id;

        fetch(`http://localhost:5000/api/courses/${courseId}`)
            .then(res => {
                if (res.status === 200) {
                    return res.json();
                } else if (res.status === 500) {
                    this.props.history.push("/error");
                    let err = new Error();

                    err.name = "Internal Server Error";
                    err.message = "Status Code: 500";
                    throw err;
                } else {
                    this.props.history.push("/notfound");
                }
            })
            .then(res => this.setState({courseDetails: res}))
            .catch(err => {
                console.error("There was a problem: " + err);
            });
    }

    delete_course = e => {
        e.preventDefault();

        if (this.props.loggedIn) {
            const userName = this.props.currentUser.emailAddress;
            const password = this.props.currentUser.password;
            const _64encoded_userAndPass = window.btoa(`${userName}:${password}`);

            const myHeader = new Headers({
                withCredentials: true,
                Authorization: "Basic " + _64encoded_userAndPass
            });

            const myRequest = new Request(`http://localhost:5000/api/courses/${this.state.courseDetails.course._id}`, {
                method: 'DELETE',
                headers: myHeader
            });

            fetch(myRequest)
                .then(res => {
                    if (res.status === 204) {
                        this.props.history.push("/courses");
                    } else if (res.status === 500) {
                        this.props.history.push("/error");
                        let err = new Error();

                        err.name = "Internal Server Error";
                        err.message = "Status Code: 500";
                        throw err;
                    } else {
                        this.props.history.push("/notfound");
                    }
                }).catch(err => {
                    console.error("There was a problem: " + err);
                });
        } else {
            this.props.history.push("/signin");
        }
    }

    should_hide = () => {
        return (this.state.courseDetails.course.user === this.props.currentUser._id) ? { display: '' } : { display: 'none' };
    }

    render() {
        let {user, course} = this.state.courseDetails;
        // let courseMaterials = course.materialsNeeded ? course.materialsNeeded.split("\n") : [];

        return (
            <div>
            <div className="actions--bar">
                <div className="bounds">
                    <div className="grid-100">
                        <span>
                            <NavLink style={this.should_hide()} className="button" to={`/courses/${course._id}/update`}>Update Course</NavLink>
                            <NavLink style={this.should_hide()} className="button" to="/" onClick={this.delete_course}>Delete Course</NavLink>
                        </span>
                        <NavLink className="button button-secondary" to="/">Return to List</NavLink>
                    </div>
                </div>
            </div>
            <div className="bounds course--detail">
                <div className="grid-66">
                    <div className="course--header">
                        <h4 className="course--label">Course</h4>
                        <h3 className="course--title">{course.title}</h3>
                        <p>By {user.firstName} {user.lastName}</p>
                    </div>
                    <div className="course--description">
                        <ReactMarkdown escapeHtml={true} source={course.description} />
                    </div>
                </div>
                <div className="grid-25 grid-right">
                    <div className="course--stats">
                        <ul className="course--stats--list">
                            <li className="course--stats--list--item">
                                <h4>Estimated Time</h4>
                                <h3>{course.estimatedTime}</h3>
                            </li>
                        <li className="course--stats--list--item">
                            <h4>Materials Needed</h4>
                                <ReactMarkdown escapeHtml={true} source={course.materialsNeeded} />
                            {/* <ul>
                                {courseMaterials.map((material, index) => <li key={index}><ReactMarkdown escapeHtml={true} source={material} /></li>)}
                            </ul> */}
                        </li>
                        </ul>
                    </div>
                </div>
            </div>
            </div>
        );
    }
}

export default CourseDetail;