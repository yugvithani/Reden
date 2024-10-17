  import React, { useEffect, useState } from 'react';
  import { useLocation, useNavigate } from 'react-router-dom';
  import SideBar from '../components/SideBar';
  import ChatScreen from '../components/ChatScreen';

  const Home = () => {
    const location = useLocation();
    const { user } = location.state || {};
    const navigate = useNavigate();
    const [selectedContact, setSelectedContact] = useState(null);

    useEffect(() => {
      if (!user) {
        navigate('/login');
      }
    }, [user, navigate]);

    // Define the onContactClick function
    const onContactClick = (contact) => {
      setSelectedContact(contact); // Set the selected contact
      console.log(contact);
    };

    return (
      <div className="h-screen flex bg-black text-gray-100">
        {/* Sidebar */}
        <SideBar onContactClick={onContactClick} />

        {/* Chat Window */}
        <ChatScreen receiverName={selectedContact ? selectedContact.receiver.username : ''} receiverId={selectedContact ? selectedContact.receiver._id : null} receiverProfilePicture={selectedContact ? `http://localhost:3000${selectedContact.receiver.profilePicture}` : 'https://via.placeholder.com/40'} />
      </div>
    );
  };

  export default Home;
