import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { register } from '../../actions/authActions';
import { useNavigate } from 'react-router-dom';

const Register = ({ register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const { username, email, password } = formData;
  const navigate = useNavigate(); // Correctly use navigate

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    // Perform any necessary validation here
    await register({ username, email, password }, navigate); // Correctly use navigate
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/'); // Redirect to home if authenticated
    }
  }, [isAuthenticated, navigate]);

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
        </div>
        <input type="submit" value="Register" />
      </form>
    </div>
  );
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { register })(Register);
