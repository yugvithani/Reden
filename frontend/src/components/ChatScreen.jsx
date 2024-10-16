import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:3000');

const ChatScreen = ({ receiverName, receiverId, receiverProfilePicture }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [senderId, setSenderId] = useState(localStorage.getItem('userId'));
    const [showDropdown, setShowDropdown] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');

        if (userId && receiverId) {
            setSenderId(userId);

            socket.emit('joinRoom', { userId });
            socket.emit('joinRoom', { userId: receiverId });

            const fetchMessages = async () => {
                try {
                    const response1 = await axios.get(`http://localhost:3000/api/msg/directMsgBetween/${userId}/${receiverId}`);
                    const response2 = await axios.get(`http://localhost:3000/api/msg/directMsgBetween/${receiverId}/${userId}`);
                    const response = response1.data.concat(response2.data);
                    setMessages(response);
                } catch (error) {
                    console.error('Error fetching messages:', error);
                }
            };

            fetchMessages();
        }

        const messageHandler = (messageData) => {
            console.log('Received message:', messageData);
            setMessages((prevMessages) => {
                // Check if the message already exists to prevent duplicates
                if (!prevMessages.some(msg => msg._id === messageData._id)) {
                    return [...prevMessages, messageData];
                }
                return prevMessages;
            });
        };

        socket.on('receiveMessage', messageHandler);

        return () => {
            socket.off('receiveMessage', messageHandler);
        };
    }, [receiverId]);

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            const messageData = {
                content: newMessage,
                sender: senderId,
                receiver: receiverId,
                isDirectMsg: true,
                type: 'msg',
                timestamp: Date.now()
            };

            try {
                const response = await axios.post('http://localhost:3000/api/msg/', messageData);

                if (response.status === 201) {
                    console.log('Message saved:', response.data);
                    socket.emit('sendMessage', response.data);
                    setNewMessage('');
                } else {
                    console.error('Failed to save the message');
                }
            } catch (error) {
                console.error('Error saving the message:', error);
            }
        }
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

    const handleLogout = () => {
        localStorage.removeItem('token'); // Remove the token
        localStorage.removeItem('userId'); // Remove the userId
        window.location.href = '/login'; // Redirect to login page
    };

    const fetchUserProfile = async () => {
        try {
            const userId = localStorage.getItem('userId'); // Get the current user ID
            const response = await axios.get(`http://localhost:3000/api/user/${userId}`); // Fetch user info
            setUserInfo(response.data); // Set the user's profile info in state
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    // Toggle dropdown and fetch user profile when opened
    const handleProfileClick = () => {
        setShowDropdown(!showDropdown);
        if (!userInfo) {
            fetchUserProfile(); // Fetch profile only once when the dropdown is opened
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-gray-900">
            {!receiverId ?
                <div className='text-center'>
                    <h1 className="text-3xl text-center text-white mt-20">Select a contact to start chatting</h1>
                </div>
                :
                <>
                    {/* Chat Header */}
                    <div className="flex justify-between items-center p-4 bg-black border-b border-gray-800">
                        <div className="flex items-center space-x-2">
                            <img
                                src={receiverProfilePicture}
                                alt="receiver"
                                className="w-10 h-10 rounded-full"
                            />
                            <h2 className="text-xl font-semibold">{receiverName}</h2>
                        </div>

                        {/* Profile Dropdown */}
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
                                                    src={userInfo.profilePicture ? `http://localhost:3000${userInfo.profilePicture}` : 'https://via.placeholder.com/150'} // Using full URL to access the image
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
                                                onClick={() => alert('Edit profile functionality coming soon!')}
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
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-800">
                        <div className="flex flex-col space-y-4">
                            {/* Sort messages by timestamp */}
                            {messages
                                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) // Sort by timestamp
                                .map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${msg.sender === senderId ? 'justify-end' : 'justify-start'} items-start space-x-2`}
                                    >
                                        <div
                                            className={`p-3 rounded-lg max-w-xs text-sm ${msg.sender === senderId ? 'bg-cyan-600 text-gray-900' : 'bg-gray-700 text-gray-200'
                                                }`}
                                        >
                                            <p>{msg.content}</p>
                                            {/* Timestamp */}
                                            <span className="flex text-xs text-gray-400 mt-1 justify-end">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>

                    {/* Message Input and Send Button */}
                    <div className="p-4 bg-black border-t border-gray-800 flex items-center">
                        <input
                            type="text"
                            placeholder="Enter a Message..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            className="flex-grow p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        />
                        <button
                            className="ml-2 bg-cyan-600 p-2 rounded-lg hover:bg-cyan-500 transition duration-300"
                            onClick={handleSendMessage}
                        >
                            ➤
                        </button>
                    </div>
                </>
            }

        </div>
    );
};

export default ChatScreen;
