import React, { useState, useEffect } from 'react'
import { createEmployee, getEmployee, updateEmployee } from '../services/EmployeeService'
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSpring, animated } from 'react-spring';
import './EmployeeComponent.css'

const EmployeeComponent = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({   // Added error state variable
        firstName: '',
        lastName: '',
        email: ''
    });

    const { id } = useParams();
    const navigator = useNavigate();
    const fadeIn = useSpring({
        from: { opacity: 0, transform: 'translate3d(0,-40px,0)' },
        to: { opacity: 1, transform: 'translate3d(0,0px,0)' }
    });

    useEffect(() => {
        if (id) {
            getEmployee(id)
                .then((response) => {
                    setFirstName(response.data.firstName);
                    setLastName(response.data.lastName);
                    setEmail(response.data.email);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [id]);

    function saveOrUpdateEmployee(e) {
        e.preventDefault();
        if (validateForm()) {
            const employee = { firstName, lastName, email };
            if (id) {
                updateEmployee(id, employee)
                    .then((response) => {
                        navigator('/employees');
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            } else {
                createEmployee(employee)
                    .then((response) => {
                        navigator('/employees');
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        }
    }

    function validateForm() {
        const newErrors = {
            firstName: firstName.trim() ? '' : 'First name is required',
            lastName: lastName.trim() ? '' : 'Last name is required',
            email: email.trim() ? '' : 'Email is required'
        };
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    }

    function pageTitle() {
        return <h2 className='text-center'>{id ? 'Update Employee' : 'Add Employee'}</h2>;
    }

    return (
        <animated.div style={fadeIn} className='container'>
            <div className='row'>
                <div className='card col-md-6 offset-md-3'>
                    {pageTitle()}
                    <div className='card-body'>
                        <form>
                            {/* First Name Field */}
                            <div className="form-group">
                                <label>First Name</label>
                                <input type="text" className={`form-control ${errors.firstName && 'is-invalid'}`}
                                       value={firstName}
                                       onChange={(e) => setFirstName(e.target.value)}/>
                                <div className="invalid-feedback">{errors.firstName}</div>
                            </div>

                            {/* Last Name Field */}
                            <div className="form-group">
                                <label>Last Name</label>
                                <input type="text" className={`form-control ${errors.lastName && 'is-invalid'}`}
                                       value={lastName}
                                       onChange={(e) => setLastName(e.target.value)}/>
                                <div className="invalid-feedback">{errors.lastName}</div>
                            </div>

                            {/* Email Field */}
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" className={`form-control ${errors.email && 'is-invalid'}`}
                                       value={email}
                                       onChange={(e) => setEmail(e.target.value)}/>
                                <div className="invalid-feedback">{errors.email}</div>
                            </div>

                            <button onClick={saveOrUpdateEmployee} className="btn btn-success">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </animated.div>
    );
};

export default EmployeeComponent;
