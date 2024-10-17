import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const UserProfile = ({ handleLogout }) => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({});
    const dropdownRef = useRef(null);

    // Fetch user profile data
    const fetchUserProfile = async () => {
        try {
            const userId = localStorage.getItem('userId'); // Get the current user ID
            const response = await axios.get(`http://localhost:3000/api/user/${userId}`); // Fetch user info
            setUserInfo(response.data); // Set the user's profile info in state
            setEditData({
                phoneNo: response.data.phoneNo,
                language: response.data.language,
                bio: response.data.bio || '',
                profilePicture: response.data.profilePicture,
            });
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    useEffect(() => {
        fetchUserProfile();
    }, []);

    // Toggle dropdown
    const handleProfileClick = () => {
        setShowDropdown(!showDropdown);
    };

    // Handle outside click for dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Handle edit modal open
    const handleEditClick = () => {
        setEditData({
            phoneNo: userInfo.phoneNo,
            language: userInfo.language,
            bio: userInfo.bio || '',
            profilePicture: userInfo.profilePicture,
        });
        setShowEditModal(true);
    };

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle profile picture change
    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditData((prevData) => ({
                ...prevData,
                profilePicture: URL.createObjectURL(file),
            }));
        }
    };

    // Submit the edit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting data:', editData);
    
        try {
            const userId = localStorage.getItem('userId');
    
            // Prepare form data for file upload
            const formData = new FormData();
            formData.append('phoneNo', editData.phoneNo);
            formData.append('language', editData.language);
            formData.append('bio', editData.bio);
    
            if (editData.profilePicture) {
                formData.append('profilePicture', editData.profilePicture);
            }
    
            // Log the FormData (for debugging)
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
    
            const response = await axios.put(`http://localhost:3000/api/user/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            console.log('Update response:', response.data);
    
            setShowEditModal(false);
            fetchUserProfile(); // Refresh user profile
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
            }
        }
    };
    

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="text-gray-300 hover:text-white transition duration-300"
                onClick={handleProfileClick} // On click, fetch and show profile
            >
                👤
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg">
                    {userInfo ? (
                        <div>
                            <div className="px-4 py-2 text-gray-700">
                                <p className="font-semibold">My Profile</p>
                                <img
                                    src={userInfo.profilePicture ? `http://localhost:3000${userInfo.profilePicture}` : 'https://via.placeholder.com/150'}
                                    alt="Profile"
                                    className="w-16 h-16 rounded-full mx-auto my-2"
                                />
                                <p><strong>Username:</strong> {userInfo.username}</p>
                                <p><strong>Email:</strong> {userInfo.email}</p>
                                <p><strong>Phone:</strong> {userInfo.phoneNo}</p>
                                <p><strong>Language:</strong> {userInfo.language}</p>
                                <p><strong>Bio:</strong> {userInfo.bio || 'No bio available'}</p>
                            </div>
                            <div className="border-t border-gray-200"></div>
                            <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={handleEditClick}
                            >
                                Edit Profile
                            </button>
                            <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="p-4 text-gray-500">Loading profile...</div>
                    )}
                </div>
            )}

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-gray-900 rounded-lg p-6 w-96">
                        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                        <form onSubmit={handleSubmit}>
                            {/* <div className="mb-4">
                                <label className="block mb-2">Profile Picture</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfilePicChange}
                                    className="block w-full text-gray-700"
                                />
                                {editData.profilePicture && (
                                    <img
                                        src={editData.profilePicture}
                                        alt="Preview"
                                        className="mt-2 w-16 h-16 rounded-full"
                                    />
                                )}
                            </div> */}
                            <div className="mb-4">
                                <label className="block mb-2">Phone No</label>
                                <input
                                    type="number"
                                    name="phoneNo"
                                    value={editData.phoneNo}
                                    onChange={handleChange}
                                    className="text-black block w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Language</label>
                                <select
                                    name="language"
                                    value={editData.language}
                                    onChange={handleChange}
                                    className="text-black block w-full p-2 border border-gray-300 rounded"
                                >
                                    <option value="Hindi">Hindi</option>
                                    <option value="Gujarati">Gujarati</option>
                                    <option value="English">English</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Bio</label>
                                <textarea
                                    name="bio"
                                    value={editData.bio}
                                    onChange={handleChange}
                                    className="text-black block w-full p-2 border border-gray-300 rounded"
                                    rows="4"
                                />
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)} // Close modal without saving
                                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
