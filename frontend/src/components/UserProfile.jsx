import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const UserProfile = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({});
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [groupData, setGroupData] = useState({ name: '', description: '' });
    const dropdownRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null); // To store the selected file
    const [availableContacts, setAvailableContacts] = useState([]); // Contacts to show in dropdown
    const [selectedParticipants, setSelectedParticipants] = useState([]); // Selected participants

    // Fetch user profile data
    const fetchUserProfile = async () => {
        try {
            const userId = localStorage.getItem('userId'); // Get the current user ID
            const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/${userId}`); // Fetch user info
            setUserInfo(response.data); // Set the user's profile info in state

            const contRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/user/${userId}/contacts`);
            setAvailableContacts(contRes.data.map(contact => contact.receiver)); 

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

    const handleCreateGroupClick = () => {
        setGroupData({ name: '', description: '' }); // Reset group data
        setShowGroupModal(true);
    };

    // Handle group input changes
    const handleGroupChange = (e) => {
        const { name, value } = e.target;
        setGroupData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Submit the group creation form
    const handleGroupSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = localStorage.getItem('userId');
            const participantIds = selectedParticipants.map(p => p._id); 

            const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/group`, {
                admin: userId,
                name: groupData.name,
                description: groupData.description,
                participants: participantIds
            });

            console.log('Group created:', response.data);

            setShowGroupModal(false); // Close modal after group creation
            fetchUserProfile(); // may no need
        } catch (error) {
            console.error('Error creating group:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
            }
        }
    };

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
    const handleProfileChange = (e) => {
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
            setSelectedFile(file); // Set the selected file to the state
            setEditData((prevData) => ({
                ...prevData,
                profilePicture: URL.createObjectURL(file), // For preview before saving
            }));
        }
    };

    // Submit the edit form
    const handleProfileSubmit = async (e) => {
        e.preventDefault();

        try {
            const userId = localStorage.getItem('userId');

            // Prepare form data for file upload
            const formData = new FormData();
            formData.append('phoneNo', editData.phoneNo);
            formData.append('language', editData.language);
            formData.append('bio', editData.bio);

            if (selectedFile) {
                formData.append('profilePicture', selectedFile); // Send the selected file to the backend
            }

            const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/user/${userId}`, formData);

            console.log('Update response:', response.data);
            setShowEditModal(false);
            fetchUserProfile(); // Refresh user profile after submission
        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response) {
                console.error('Response data:', error.response.data);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        localStorage.removeItem('userId'); 
        window.location.href = '/login';
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
                                    src={userInfo.profilePicture ? `${import.meta.env.VITE_API_BASE_URL}${userInfo.profilePicture}` : 'https://via.placeholder.com/150'}
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
                                onClick={handleCreateGroupClick}
                            >
                                Create Group
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
                        <form onSubmit={handleProfileSubmit}>
                            <div className="mb-4">
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
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Phone No</label>
                                <input
                                    type="number"
                                    name="phoneNo"
                                    value={editData.phoneNo}
                                    onChange={handleProfileChange}
                                    className="text-black block w-full p-2 border border-gray-300 rounded"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Language</label>
                                <select
                                    name="language"
                                    value={editData.language}
                                    onChange={handleProfileChange}
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
                                    onChange={handleProfileChange}
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

            {/* Create Group Modal */}
            {showGroupModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-gray-900 rounded-lg p-6 w-96">
                        <h2 className="text-xl font-semibold mb-4">Create Group</h2>
                        <form onSubmit={handleGroupSubmit}>
                            <div className="mb-4">
                                <label className="block mb-2">Group Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={groupData.name}
                                    onChange={handleGroupChange}
                                    className="text-black block w-full p-2 border border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={groupData.description}
                                    onChange={handleGroupChange}
                                    className="text-black block w-full p-2 border border-gray-300 rounded"
                                    rows="3"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-2">Participants</label>
                                <div>
                                    {/* Dropdown for selecting participants */}
                                    <select
                                        onChange={(e) => {
                                            const selectedContact = availableContacts.find(contact => contact._id === e.target.value);
                                            if (selectedContact) {
                                                // Immediately update available contacts to avoid duplication
                                                const updatedAvailableContacts = availableContacts.filter(contact => contact._id !== e.target.value);
                                                setAvailableContacts(updatedAvailableContacts); // Update available contacts

                                                // Add to selected participants
                                                setSelectedParticipants(prev => [...prev, selectedContact]);

                                                e.target.value = ""; // Reset dropdown
                                            }
                                        }}
                                        className="text-black block w-full p-2 border border-gray-300 rounded"
                                    >
                                        <option value="">Select a contact</option>
                                        {availableContacts.map(contact => (
                                            <option key={contact._id} value={contact._id}>
                                                {contact.username}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Display selected participants */}
                                <div className="mt-2">
                                    {selectedParticipants.map(participant => (
                                        <span
                                            key={participant._id}
                                            className="inline-flex items-center bg-blue-200 text-blue-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded"
                                        >
                                            {participant.username}
                                            <button
                                                onClick={() => {
                                                    // Remove from selected participants
                                                    const updatedParticipants = selectedParticipants.filter(p => p._id !== participant._id);
                                                    setSelectedParticipants(updatedParticipants);

                                                    // Add back to available contacts
                                                    setAvailableContacts(prev => [...prev, participant]);
                                                }}
                                                className="ml-1 text-blue-600 hover:text-blue-800"
                                            >
                                                &times;
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => setShowGroupModal(false)}
                                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Create Group
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
