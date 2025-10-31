import { useState } from 'react';
import './Auth.css';

const Login = () => {
  const [userType, setUserType] = useState('user');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement login logic here
    console.log('Login attempt:', { ...formData, userType });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome to SmartCheck</h2>
        <h3>Login {userType === 'admin' ? 'Admin' : 'User'}</h3>
        
        <div className="user-type-toggle">
          <button 
            className={userType === 'user' ? 'active' : ''} 
            onClick={() => setUserType('user')}
          >
            User
          </button>
          <button 
            className={userType === 'admin' ? 'active' : ''} 
            onClick={() => setUserType('admin')}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="submit-btn">
            Login
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
