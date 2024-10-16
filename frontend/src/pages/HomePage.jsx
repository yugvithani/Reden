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

    const handleLogout = () => {
      localStorage.removeItem('token'); 
      localStorage.removeItem('userId'); // Also remove userId if necessary
      navigate('/login');
    };

    // Define the onContactClick function
    const onContactClick = (contact) => {
      setSelectedContact(contact); // Set the selected contact
    };

    return (
      <div className="h-screen flex bg-black text-gray-100">
        {/* Sidebar */}
        <SideBar onContactClick={onContactClick} />

        {/* Chat Window */}
        <ChatScreen receiverName={selectedContact ? selectedContact.receiver.username : 'Select a contact'} receiverId={selectedContact ? selectedContact.receiver._id : null} />
      </div>
    );
  };

  export default Home;
