import { useState } from 'react';
import axios from 'axios';
import { FaCamera, FaPhoneVolume, FaLinkedin, FaSearch } from 'react-icons/fa';
import { AiTwotoneMail, AiTwotoneFolderOpen } from 'react-icons/ai';
import { IoMdLock } from 'react-icons/io';
import { HiUser } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    profilePicture: null,
    firstName: '',
    lastName: '',
    nameWithInitials: '',
    phoneNumber: '',
    email: '',
    password: '',
    gender: '',
    experience: '',
    portfolioURL: '',
    linkedinURL: '',
    skills: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'profilePicture') {
      setFormData({ ...formData, profilePicture: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
  

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.nameWithInitials) newErrors.nameWithInitials = "Name with initials is required";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.experience) newErrors.experience = "Experience level is required";
    if (!formData.skills) newErrors.skills = "Skills are required";
    
    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);

    const formDataToSend = new FormData();
    for (const key in formData) {
      if (key === 'skills') {
        formDataToSend.append(key, formData[key].split(',').map(s => s.trim()));
      } else if (formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    }

    try {
      await axios.post('http://localhost:5000/api/auth/register', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/login');
      alert('Registration successful! Please login.');

    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ server: error.response?.data?.message || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl w-[35%] bg-white/85 p-8 shadow-lg rounded-lg">
      <h2 className="text-2xl font-extrabold text-center text-gray-900 mb-6">
        Profile Registration
      </h2>
      {errors.server && (
        <div className="text-red-500 text-center mb-4">{errors.server}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Picture */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">
            Profile Picture
          </label>
          <div className="relative">
            <FaCamera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="file"
              name="profilePicture"
              onChange={handleChange}
              accept="image/*"
              className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              First Name
            </label>
            <div className="relative">
              <HiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Last Name
            </label>
            <div className="relative">
              <HiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
          </div>
        </div>
        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Name with Initials
            </label>
            <div className="relative">
              <HiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                name="nameWithInitials"
                value={formData.nameWithInitials}
                onChange={handleChange}
                placeholder="Enter name with initials"
                className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            {errors.nameWithInitials && <p className="text-red-500 text-sm">{errors.nameWithInitials}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <FaPhoneVolume className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
          </div>
        </div>
        {/* Email & Password */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Email
            </label>
            <div className="relative">
              <AiTwotoneMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Password
            </label>
            <div className="relative">
              <IoMdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>
        </div>
        {/* Gender & Experience */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Experience Level
            </label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="">Select Experience Level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
          </div>
        </div>
        {/* Portfolio & LinkedIn */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Portfolio URL
            </label>
            <div className="relative">
              <AiTwotoneFolderOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="url"
                name="portfolioURL"
                value={formData.portfolioURL}
                onChange={handleChange}
                placeholder="Enter portfolio URL"
                className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              LinkedIn URL
            </label>
            <div className="relative">
              <FaLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="url"
                name="linkedinURL"
                value={formData.linkedinURL}
                onChange={handleChange}
                placeholder="Enter LinkedIn URL"
                className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          </div>
        </div>
        {/* Skills */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">
            Skills (comma-separated)
          </label>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g., JavaScript, React, Node.js"
              className="w-full pl-10 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
          {errors.skills && <p className="text-red-500 text-sm">{errors.skills}</p>}
        </div>
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;