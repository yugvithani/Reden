import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfile = ({ userId, onProfileUpdated }) => {
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phoneNo: '',
    profilePicture: '',
    language: '',
    bio: '',
  });

  useEffect(() => {
    // Fetch user profile data from backend
    axios.get(`/api/user/${userId}/profile`)
      .then(response => {
        setProfileData(response.data);
      })
      .catch(error => {
        console.error('Error fetching profile data', error);
      });
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    // Update profile via API call
    axios.put(`/api/user/${userId}/profile`, profileData)
      .then(response => {
        onProfileUpdated(response.data);  // Notify parent component about the update
      })
      .catch(error => {
        console.error('Error updating profile', error);
      });
  };

  return (
    <form onSubmit={handleFormSubmit} className="bg-gray-800 p-4 rounded-lg">
      <h2 className="text-lg font-semibold text-white mb-4">Edit Profile</h2>

      <div className="mb-4">
        <label className="block text-gray-400">Username</label>
        <input
          type="text"
          name="username"
          value={profileData.username}
          onChange={handleInputChange}
          className="p-2 bg-gray-700 text-white w-full rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-400">Email</label>
        <input
          type="email"
          name="email"
          value={profileData.email}
          onChange={handleInputChange}
          className="p-2 bg-gray-700 text-white w-full rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-400">Phone No</label>
        <input
          type="text"
          name="phoneNo"
          value={profileData.phoneNo}
          onChange={handleInputChange}
          className="p-2 bg-gray-700 text-white w-full rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-400">Language</label>
        <input
          type="text"
          name="language"
          value={profileData.language}
          onChange={handleInputChange}
          className="p-2 bg-gray-700 text-white w-full rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-400">Bio</label>
        <textarea
          name="bio"
          value={profileData.bio}
          onChange={handleInputChange}
          className="p-2 bg-gray-700 text-white w-full rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-400">Profile Picture URL</label>
        <input
          type="text"
          name="profilePicture"
          value={profileData.profilePicture}
          onChange={handleInputChange}
          className="p-2 bg-gray-700 text-white w-full rounded"
        />
      </div>

      <button type="submit" className="bg-cyan-600 p-2 rounded text-white">
        Save Changes
      </button>
    </form>
  );
};

export default EditProfile;
