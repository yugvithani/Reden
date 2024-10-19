import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import UserProfile from './UserProfile';
import GroupInfo from './GroupInfo';

const socket = io('http://localhost:3000');

const ChatScreen = ({ receiverName, receiverId, receiverProfilePicture, isGroupChat }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [senderId, setSenderId] = useState(localStorage.getItem('userId'));
    const [isLoading, setIsLoading] = useState(false);
    const lastMessageRef = useRef(null);

    useEffect(() => {
        const userId = localStorage.getItem('userId');

        if (userId && receiverId) {
            setSenderId(userId);
            setIsLoading(true);

            // Join room logic based on whether it's a group chat or direct message
            if (isGroupChat) {
                socket.emit('joinRoom', { groupId: receiverId });
            } else {
                socket.emit('joinRoom', { userId });
                socket.emit('joinRoom', { userId: receiverId });
            }

            const fetchMessages = async () => {
                try {
                    let response;
                    if (isGroupChat) {
                        // Fetch group messages
                        response = await axios.get(`http://localhost:3000/api/msg/group/${receiverId}`);
                        response = response.data;
                    } else {
                        // Fetch direct messages
                        const response1 = await axios.get(`http://localhost:3000/api/msg/directMsgBetween/${userId}/${receiverId}`);
                        const response2 = await axios.get(`http://localhost:3000/api/msg/directMsgBetween/${receiverId}/${userId}`);
                        response = response1.data.concat(response2.data);
                    }
                    setMessages(response);
                }
                catch (error) {
                    console.error('Error fetching messages:', error);
                }
                finally {
                    setIsLoading(false);
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
    }, [receiverId, isGroupChat]);

    // for scroll upto end msg
    useEffect(() => {
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            const messageData = {
                content: newMessage,
                sender: senderId,
                receiver: isGroupChat ? null : receiverId,
                isDirectMsg: !isGroupChat,
                group: isGroupChat ? receiverId : null,
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

    return (
        <div className="flex-1 flex flex-col bg-gray-900">
            {/* CSS for hiding the scrollbar */}
            <style>{`
                /* Hide scrollbar for WebKit-based browsers (Chrome, Safari, etc.) */
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }

                /* Hide scrollbar for Firefox */
                .hide-scrollbar {
                    scrollbar-width: none;
                    -ms-overflow-style: none; /* IE and Edge */
                }
            `}</style>

            {/* Chat Header */}
            <div className="flex justify-between items-center p-4 bg-gray-900 border-b border-gray-800">
                <div className="flex items-center space-x-2">
                    {receiverName && !isGroupChat && (
                        <img
                            src={receiverProfilePicture}
                            alt="receiver"
                            className="w-10 h-10 rounded-full"
                        />
                    )}
                    <h2 className="text-xl font-semibold">{receiverName}</h2>

                    {isGroupChat && (
                        <GroupInfo
                            groupId={receiverId}
                        />
                    )}
                </div>

                {/* User Profile */}
                <UserProfile />
            </div>

            {!receiverId ? (
                <div className="text-center">
                    <h1 className="text-3xl text-center text-white mt-20">Select a contact or group to start chatting</h1>
                </div>
            ) : (
                isLoading ? (
                    <div className="flex-1 flex justify-center items-center">
                        <h1 className="text-white text-2xl">Loading...</h1>
                    </div>
                ) : (
                    <>
                        {/* Chat Messages */}
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-800 hide-scrollbar">
                            <div className="flex flex-col space-y-4">
                                {messages
                                    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                                    .map((msg, index) => (
                                        <div
                                            key={index}
                                            ref={index === messages.length - 1 ? lastMessageRef : null}
                                            className={`flex ${msg.sender._id === senderId ? 'justify-end' : 'justify-start'} items-start space-x-2`}
                                        >

                                            <div
                                                className={`p-3 rounded-lg max-w-xs text-sm ${msg.sender._id === senderId ? 'bg-cyan-700 text-gray-200' : 'bg-gray-700 text-gray-200'}`}
                                            >
                                                {/* Show sender's name in group chat */}
                                                {msg.sender._id !== senderId && isGroupChat && (
                                                    <div className="text-xs text-black mb-1">
                                                        {msg.sender.username || 'Unknown'}
                                                    </div>
                                                )}
                                                <p>{msg.content}</p>
                                                <span className="flex text-xs text-gray-400 mt-1 justify-end">
                                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>

                        {/* Message Input */}
                        <div className="p-4 bg-gray-800 border-t border-gray-800 flex items-center">
                            <input
                                type="text"
                                placeholder="Enter a Message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="flex-grow p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                            <button
                                className="ml-2 bg-gray-800 p-2 rounded-lg hover:bg-cyan-700 transition duration-300"
                                onClick={handleSendMessage}
                            >
                                ➤
                            </button>
                        </div>
                    </>
                )
            )}
        </div>
    );
};

export default ChatScreen;
