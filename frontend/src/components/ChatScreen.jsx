import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Update with your backend URL

const ChatScreen = ({ receiverName, receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [senderId, setSenderId] = useState(localStorage.getItem('userId')); // Fetch sender ID from local storage
  // if (!receiverId) {
  //   return (
  //     <div className="flex-1 flex flex-col bg-gray-900 p-4">
  //       <h2 className="text-lg text-gray-500">Select a contact to start chatting</h2>
  //     </div>
  //   );
  // }
  useEffect(() => {
    // Listen for incoming messages
    socket.on('receiveMessage', (messageData) => {
      console.log('Received message:', messageData);
      setMessages((prevMessages) => [...prevMessages, messageData]);
    });

    return () => {
      socket.off('receiveMessage'); // Clean up the listener on component unmount
    };
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const messageData = {
        content: newMessage,
        sender: senderId,
        receiver: receiverId,
        isDirectMsg: true,
        type: 'msg', // Assuming type is 'msg' for text
      };
      console.log('Sending message:', messageData);
      socket.emit('sendMessage', messageData); // Emit the message to the server
      setMessages((prevMessages) => [...prevMessages, messageData]); // Update local messages immediately
      setNewMessage(''); // Clear the input field
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
        <button className="text-gray-300 hover:text-white transition duration-300">
          👤
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-800">
        <div className="flex flex-col space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === senderId ? 'justify-end' : 'justify-start'} items-start space-x-2`}>
              <div className={`p-3 rounded-lg max-w-xs text-sm ${msg.sender === senderId ? 'bg-cyan-600 text-gray-900' : 'bg-gray-700 text-gray-200'}`}>
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
