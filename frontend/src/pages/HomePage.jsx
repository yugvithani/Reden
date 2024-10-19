import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SideBar from '../components/SideBar';
import ChatScreen from '../components/ChatScreen';

const Home = () => {
  const location = useLocation();
  const { user } = location.state || {};
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Define the onContactClick function
  const onContactClick = (contact) => {
    setSelectedItem(contact); // Set the selected contact
    console.log(contact);
  };

  return (
    <div className="h-screen flex bg-black text-gray-100">
      {/* Sidebar */}
      <SideBar onContactClick={onContactClick} />

      {/* Chat Window */}
      <ChatScreen
        receiverName={selectedItem ? (selectedItem.type === 'group' ? selectedItem.name : selectedItem.receiver.username) : ('')}
        receiverId={selectedItem ? (selectedItem.type === 'group' ? selectedItem._id : selectedItem.receiver._id) : null}
        receiverProfilePicture={selectedItem ? (selectedItem.type === 'group' ? null : `http://localhost:3000${selectedItem.receiver.profilePicture}`) : 'https://via.placeholder.com/40'}
        isGroupChat={selectedItem ? (selectedItem.type === 'group') : (false)}
      />
    </div>
  );
};

export default Home;
