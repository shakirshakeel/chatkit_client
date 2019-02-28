import React, { Component } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom'
import './login.css';
import View from '../..';

class LoginForm extends Component {
    state = { email: '', password: '' };

    onChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { email, password } = this.state;

        const form = new FormData();
        form.append('email', email);
        form.append('password', password);

        axios.post('http://13.95.65.188/api/auth/login', form, {})
            .then(({data}) => {
                console.log(data)
              localStorage.setItem('chatkit-user', JSON.stringify(data) );  
              ReactDOM.render(<View />, document.querySelector('#root'));
            })
            .catch(console.log)
    }

    render() {
        const { email, password } = this.state;

        return (
            <div className="login-form" onSubmit={this.onSubmit} >
                <form>
                    <div className="form-group">
                        <label htmlFor="email">Email address</label>
                        <input type="text" value={email} onChange={this.onChange} className="form-control" name="email" placeholder="Enter email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" value={password} onChange={this.onChange} className="form-control" name="password" placeholder="Password" />
                    </div>
                    <button className="btn btn-primary">Submit</button>
                </form>
            </div>
        )
    }
}

export default LoginForm;