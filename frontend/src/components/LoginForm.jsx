import { useState } from 'react';
import { login } from '../services/api';

const LoginForm = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '', 
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const {token, user} = await login(formData); // Call login API

      // Store token in localStorage
      localStorage.setItem('token', token);

      // Call the success handler to redirect to home page
      onLoginSuccess(user);
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full">
        <h2 className="text-2xl mb-6 text-center font-semibold">Login</h2>

        {/* Username Field */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            id="username"
            name="username"
            type="text"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            id="password"
            name="password"
            type="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p className="text-red-500 text-xs italic">{error}</p>}

        <div className="flex items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
            Login
          </button>
        </div>
      </form>
    </>
    
  );
};

export default LoginForm;
