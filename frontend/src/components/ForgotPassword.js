import { useState } from 'react';
import axios from 'axios';
import { AiTwotoneMail } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage('Password reset email sent. Check your inbox.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error sending reset email');
    }
  };

  return (
    <div className="max-w-md w-[20%] bg-white p-8 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Forgot Password</h2>
      {message && <div className="text-green-500 text-center mb-4">{message}</div>}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-2">Email</label>
          <div className="relative">
            <AiTwotoneMail className="absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 px-4 py-2 border rounded-lg"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Send Reset Email
        </button>
        <div className="text-center mt-4">
          <Link to="/login" className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;