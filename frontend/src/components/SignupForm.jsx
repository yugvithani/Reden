import { useState } from 'react';
import { signup } from '../services/api';

const SignupForm = ({onSignupSuccess}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '', // extra
    email: '',
    phoneNo: '',
    profilePicture: '',
    language: '',
    bio: '',
  });
  
  const [errors, setErrors] = useState({}); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    const emailExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // [^\s@] -> str but no ' ' & '@'. ^ -> start of string
    if(!emailExp.test(formData.email)){
      newErrors.email = "Email format is invalid"
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

    //validate form data
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Proceed with API request mean signup is call by API
    try {
      const { confirmPassword, ...signupData } = formData;
      const res = await signup(signupData);
      setErrors({});

      if(res == 400){ // signup is not allowed with same username or email
        setErrors({signup: "User already exist."});
        return;
      }
      onSignupSuccess();
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="text-2xl mb-6 text-center font-semibold">Sign Up</h2>
        
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

        {/* phoneNo Field */}
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="phoneNo">Phone Number</label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight
                  focus:outline-none focus:shadow-outline 
                  [&::-webkit-outer-spin-button]:appearance-none 
                  [&::-webkit-inner-spin-button]:appearance-none 
                  [-moz-appearance:textfield] "
            id="phoneNo"
            name="phoneNo"
            type="number"
            placeholder='Enter phone number'
            inputMode="numeric" // restrict to numeric input
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
