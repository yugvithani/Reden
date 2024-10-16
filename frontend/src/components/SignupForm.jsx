import { useState } from 'react';
import { signup } from '../services/api';

const SignupForm = ({ onSignupSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    phoneNo: '',
    profilePicture: null,
    language: '',
    bio: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      if (files[0]) {
        const file = files[0];
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
          setErrors({ ...errors, profilePicture: 'Invalid file type. Only JPEG, PNG, and GIF are allowed.' });
          return;
        }
        if (file.size > 2 * 1024 * 1024) { // 2 MB limit
          setErrors({ ...errors, profilePicture: 'File size must be less than 2MB.' });
          return;
        }
        setErrors({ ...errors, profilePicture: null }); // Clear error if valid
        setFormData({
          ...formData,
          profilePicture: file,
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const emailExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailExp.test(formData.email)) {
      newErrors.email = "Email format is invalid";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.language === "") {
      newErrors.language = "Please select a language";
    }

    if (formData.phoneNo.length !== 10) {
      newErrors.phoneNo = "Phone number must be 10 digits long";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Create FormData to handle file upload
    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.username);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('phoneNo', formData.phoneNo);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('language', formData.language);
    formDataToSend.append('bio', formData.bio);
    if (formData.profilePicture) {
      formDataToSend.append('profilePicture', formData.profilePicture);
    }

    try {
      const res = await signup(formDataToSend);
      setErrors({});

      if (res.status === 400) {
        setErrors({ signup: "User already exists." });
        return;
      }
      onSignupSuccess();
      console.log(res);
    } catch (error) {
      console.error(error);
      setErrors({ signup: "An error occurred during signup." });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md" encType="multipart/form-data">
        <h2 className="text-2xl mb-6 text-center font-semibold">Sign Up</h2>

        {/* Profile Picture Field */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="profilePicture">Profile Picture</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            id="profilePicture"
            name="profilePicture"
            type="file"
            onChange={handleChange}
          />
          {errors.profilePicture && <p className="text-red-500 text-xs italic">{errors.profilePicture}</p>}
          {formData.profilePicture && (
            <img
              src={URL.createObjectURL(formData.profilePicture)}
              alt="Profile Preview"
              className="mt-2 w-20 h-20 object-cover rounded"
            />
          )}
        </div>

        {/* Username Field */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="username">Username</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            id="username"
            name="username"
            type="text"
            placeholder='Enter username'
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="email">Email</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            id="email"
            name="email"
            type="text"
            placeholder='Enter email'
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
        </div>

        {/* Phone Number Field */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="phoneNo">Phone Number</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            id="phoneNo"
            name="phoneNo"
            type="number"
            placeholder='Enter phone number'
            inputMode="numeric"
            value={formData.phoneNo}
            onChange={handleChange}
            required
          />
          {errors.phoneNo && <p className="text-red-500 text-xs italic">{errors.phoneNo}</p>}
        </div>

        {/* Language Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="language">Language</label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight"
          >
            <option value="" className="text-gray-700">Please select</option>
            <option value="Gujarati">Gujarati</option>
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
          </select>
          {errors.language && <p className="text-red-500 text-xs italic">{errors.language}</p>}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="password">Password</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            id="password"
            name="password"
            type="password"
            placeholder='Enter password'
            value={formData.password}
            onChange={handleChange}
            required
          />
          {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
        </div>

        {/* Confirm Password Field */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="confirmPassword">Confirm Password</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder='Confirm password'
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs italic">{errors.confirmPassword}</p>}
        </div>

        {errors.signup && <p className="text-red-500 text-xs italic">{errors.signup}</p>}

        <div className="flex items-center justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
            Sign Up
          </button>
        </div>
      </form>
    </>
  );
};

export default SignupForm;
