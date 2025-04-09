import { useState } from 'react';
import axios from 'axios';
import { AiTwotoneMail } from 'react-icons/ai';
import { HiUser } from 'react-icons/hi';
import { IoMdLock } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    // fullName: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dash');
      
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || 'Invalid credentials');
      } else {
        setError('Server is not reachable');
      }
    }
  };

  return (
    <div className="max-w-md w-[20%] bg-white p-8 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-black-700 mb-6">
        Signin
      </h2>
      {error && <div className="text-red-500 text-sm text-center mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name Field */}

       
        
        {/* Email Field */}
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-2">
            Email
          </label>
          <div className="relative">
            <AiTwotoneMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter email"
              required
            />
          </div>
        </div>
        {/* Password Field */}
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-2">
            Password
          </label>
          <div className="relative">
            <IoMdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              placeholder="Enter password"
              required
            />
          </div>
        </div>
        {/* Forgot Password Link */}
        <div className="text-right">
          <Link 
            to="/forgot-password" 
            className="text-red-500 text-sm hover:underline"
          >
            Forgot Password?
          </Link>
        </div>
        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Signin
        </button>
        {/* Registration Link */}
        <div className="text-center mt-4">
          <span className="text-gray-600">Don't have an account? </span>
          <Link 
            to="/register" 
            className="text-blue-500 hover:underline"
          >
            Register
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;