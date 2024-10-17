import React, { useState, useEffect } from 'react';
import ContactList from './ContactList';
import SearchBar from './SearchBar';
import { io } from 'socket.io-client';

const SideBar = ({ onContactClick }) => {
  const [contacts, setContacts] = useState([]); // Store fetched contacts
  const [filteredContacts, setFilteredContacts] = useState([]); // Store filtered contacts
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [newContactUsername, setNewContactUsername] = useState(''); // New contact username

  useEffect(() => {
    fetchContacts();

    // Initialize socket connection
    const socket = io('http://localhost:3000');

    // Listen for real-time updates of new contacts
    const userId = localStorage.getItem('userId');
    if(userId)
      socket.emit('joinRoom', {userId}); // Join the socket room

    socket.on('new-contact', () => {
      fetchContacts(); // Update contacts when a new contact is added in real-time
    });

    return () => {
      socket.disconnect(); // Cleanup on component unmount
    };
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:3000/api/user/${userId}/contacts`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }

      const data = await response.json();
      setContacts(data);
      setFilteredContacts(data); // Initialize filtered contacts
    } catch (err) {
      console.error(err);
    }
  };

  // Function to handle the search input
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm); // Update the search term

    // Filter contacts based on the search term
    const filtered = contacts.filter((contact) =>
      contact.receiver.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered); // Update the filtered contacts
  };

  // Toggle modal visibility
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  // Handle submit for new contact
  const handleSubmitNewContact = async () => {
    if (!newContactUsername) return;

    try {
      // Fetch the contact's userId based on the username
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      // Fetch the user details by username
      const response = await fetch(`http://localhost:3000/api/user/getUserByUsername/${newContactUsername}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Failed to find user by username');
        return;
      }

      const contactUser = await response.json();

      if (!contactUser) {
        alert('User not found');
        return;
      }

      const contactId = contactUser._id;

      // Make API call to create the contact
      const createContactResponse = await fetch(`http://localhost:3000/api/user/contactBetween/${userId}/${contactId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (createContactResponse.ok) {
        console.log('Contact added successfully');

        fetchContacts(); // Assuming fetchContacts is a function that updates the contacts in the SideBar
        setNewContactUsername('');
        setShowModal(false); // Close the modal after submission
      } else {
        const errorData = await createContactResponse.json();
        alert(errorData.message || 'Error adding contact');
      }
    } catch (error) {
      console.error('Error submitting new contact:', error);
    }
  };

  return (
    <div className="w-1/4 bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
      <div className="mb-4">
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* My Contacts header and Add New Contact Button */}
        <div className="flex justify-between items-center mt-4">
          <h2 className="text-xl font-semibold text-gray-100">My Contacts</h2>

          {/* Add New Contact Button */}
          <button
            className="bg-cyan-600 text-white px-3 py-1 rounded-full hover:bg-cyan-500 transition duration-300"
            onClick={toggleModal}
          >
            +
          </button>
        </div>
      </div>

      {/* My Contacts */}
      <ContactList contacts={filteredContacts} onContactClick={onContactClick} />

      {/* Modal for adding a new contact */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 rounded-lg p-6 w-1/3">
            <h2 className="text-xl text-white mb-4">Add New Contact</h2>

            {/* Username input */}
            <input
              type="text"
              placeholder="Enter username"
              value={newContactUsername}
              onChange={(e) => setNewContactUsername(e.target.value)}
              className="w-full p-2 mb-4 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              {/* Close Button */}
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
                onClick={toggleModal}
              >
                Close
              </button>

              {/* Submit Button */}
              <button
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-500"
                onClick={handleSubmitNewContact}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
