import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';




class Courses extends Component {
    constructor() {
        super();
        this.state = {
            courses: []
        }
    }

    componentDidMount() {
        fetch("https://tech10-rest-api.herokuapp.com/api/courses")
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
            .then(res => {
                let uniqueKey = 0;
                // Individual course buttons
                let receivedCourses = res.map((item, index) => {
                    uniqueKey += 1;
                    return (
                        <div className="grid-33" key={index}> 
                            <NavLink className="course--module course--link" to={`/courses/${item._id}`}>
                                <h4 className="course--label">Course</h4>
                                <h3 className="course--title">{item.title}</h3>
                            </NavLink>
                        </div>);
                    }
                );

                // Add "new course" button
                receivedCourses.push(
                    <div className="grid-33" key={uniqueKey}>
                        <NavLink className="course--module course--add--module" to="/courses/create">
                            <h3 className="course--add--title">
                                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                                    viewBox="0 0 13 13" className="add">
                                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                            </svg>New Course</h3>
                        </NavLink>
                    </div>
                )

                this.setState(() => ({courses : receivedCourses}));
            }).catch(err => {
                console.error("There was a problem: " + err);
            });
    }

    render() {
        return (
            <div className="bounds">
                {this.state.courses}
            </div>);
    }
}

export default Courses;