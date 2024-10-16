import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios'; // For API requests

const socket = io('http://localhost:3000'); // Update with your backend URL

const ChatScreen = ({ receiverName, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderId, setSenderId] = useState(localStorage.getItem('userId')); // Fetch sender ID from local storage
  const [showDropdown, setShowDropdown] = useState(false); // To control profile dropdown visibility
  const [userInfo, setUserInfo] = useState(null); // Store user's profile information
  const dropdownRef = useRef(null); // Reference to dropdown for closing it when clicked outside

  // Fetch messages between the sender and receiver when the component mounts
  useEffect(() => {
  const userId = localStorage.getItem('userId'); // Fetch senderId from localStorage

  if (userId && receiverId) {  // Ensure both senderId and receiverId are available
    setSenderId(userId);

    // User joins their room on connection
    // socket.emit('joinRoom', { userId });

    // console.log(`User ${userId} has joined their room.`);

    // Fetch previous messages between the sender and receiver
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/msg/directMsgBetween/${userId}/${receiverId}`);
        setMessages(response.data); // Set the fetched messages
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages(); // Fetch messages only after both sender and receiver IDs are available

    // Listen for incoming messages
    socket.on('receiveMessage', (messageData) => {
      console.log('Received message:', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]); // Append received message to the list
    });
  }

  return () => {
    socket.off('receiveMessage');  // Clean up the listener when the component unmounts
    // socket.emit('leaveRoom', { userId });  // Optional: Leave the room when the component unmounts
  };
}, [receiverId]);  // Ensure this useEffect runs when receiverId changes


  useEffect(() => {
    // Listen for incoming messages via Socket.IO
    socket.on('receiveMessage', (messageData) => {
      console.log('Received message:', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]); // Append received message to the list
    });

    return () => {
      socket.off('receiveMessage'); // Clean up the listener on component unmount
    };
  }, []);

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

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const messageData = {
        content: newMessage,
        sender: senderId,
        receiver: receiverId,
        isDirectMsg: true,
        type: 'msg', // Assuming type is 'msg' for text
      };
  
      try {
        // Save message to the database via API
        const response = await axios.post('http://localhost:3000/api/msg/', messageData);
        
        if (response.status === 201) {
          console.log('Message saved:', response.data);
  
          // Emit the message to the server via Socket.IO
          socket.emit('sendMessage', messageData); 
  
          // Update local messages immediately
          setMessages((prevMessages) => [...prevMessages, messageData]);
  
          // Clear the input field
          setNewMessage('');
        } else {
          console.error('Failed to save the message');
        }
      } catch (error) {
        console.error('Error saving the message:', error);
      }
    }
  };
  

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
      {/* Chat Header */}
      <div className="flex justify-between items-center p-4 bg-black border-b border-gray-800">
        <div className="flex items-center space-x-2">
          <img
            src="https://via.placeholder.com/40"
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
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender === senderId ? 'justify-end' : 'justify-start'} items-start space-x-2`}
            >
              <div
                className={`p-3 rounded-lg max-w-xs text-sm ${msg.sender === senderId ? 'bg-cyan-600 text-gray-900' : 'bg-gray-700 text-gray-200'
                  }`}
              >
                <p>{msg.content}</p>
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
    </div>
  );
};

export default ChatScreen;
