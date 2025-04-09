import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoMdLock } from 'react-icons/io';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, {
        password
      });
      setMessage('Password reset successfully!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error resetting password');
    }
  };

  return (
    <div className="max-w-md w-[20%] bg-white p-8 shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Reset Password</h2>
      {message && <div className="text-green-500 text-center mb-4">{message}</div>}
      {error && <div className="text-red-500 text-center mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold mb-2">New Password</label>
          <div className="relative">
            <IoMdLock className="absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 px-4 py-2 border rounded-lg"
              placeholder="Enter new password"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Confirm Password</label>
          <div className="relative">
            <IoMdLock className="absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 px-4 py-2 border rounded-lg"
              placeholder="Confirm new password"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;