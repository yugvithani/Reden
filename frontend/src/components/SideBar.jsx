import React, { useState, useEffect } from 'react';
import ContactList from './ContactList';
import SearchBar from './SearchBar';
import { io } from 'socket.io-client';

const SideBar = ({ onContactClick }) => {
  const [contacts, setContacts] = useState([]); // Store fetched contacts
  const [filteredContacts, setFilteredContacts] = useState([]); // Store filtered contacts
  const [searchTerm, setSearchTerm] = useState(''); // Search term state
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const [newContactUsername, setNewContactUsername] = useState(''); // New contact username
  const [isNewGroup, setIsNewGroup] = useState(false);
  const [newGroupCode, setNewGroupCode] = useState('');
  const [selectedContactId, setSelectedContactId] = useState(null); // Track the selected contact
  const [errorMessage, setErrorMessage] = useState(''); // Store error message for the UI

  // Fetch contacts and initialize socket connection
  useEffect(() => {
    fetchContacts();

    // Initialize socket connection
    const socket = io(`${import.meta.env.VITE_API_BASE_URL}`);

    // Listen for real-time updates of new contacts
    const userId = localStorage.getItem('userId');
    if (userId) {
      socket.emit('joinRoom', { userId }); // Join the socket room
    }

    socket.on('new-contact', () => {
      fetchContacts(); // Update contacts when a new contact is added in real-time
    });

    // Listen for real-time updates of new groups
    socket.on('group-created', (newGroup) => {
      setContacts(prevContacts => [
        ...prevContacts,
        { ...newGroup, type: 'group' }, // Add new group to contacts state
      ]);
      setFilteredContacts(prevFilteredContacts => [
        ...prevFilteredContacts,
        { ...newGroup, type: 'group' }, // Update filtered contacts
      ]);
    });

    return () => {
      socket.disconnect(); // Cleanup on component unmount
    };
  }, []);

  // Fetch contacts and groups
  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      // Fetch user contacts and groups
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/${userId}/contactsAndGroups`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contacts and groups');
      }

      const data = await response.json();

      const combinedData = [
        ...data.contacts.map(contact => ({ ...contact, type: 'contact' })),
        ...data.groups.map(group => ({ ...group, type: 'group' }))
      ];
      setContacts(combinedData); // Combine contacts and groups
      setFilteredContacts(combinedData); // Initialize filtered list
    } catch (err) {
      console.error(err);
    }
  };

  // Function to handle the search input
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm); // Update the search term

    // Filter contacts and group based on the search term
    const filtered = contacts.filter((item) => {
      if (item.type === 'contact') {
        return item.receiver.username.toLowerCase().includes(searchTerm.toLowerCase());
      } else if (item.type === 'group') {
        return item.name.toLowerCase().includes(searchTerm.toLowerCase());
      }
      return false;
    });
    setFilteredContacts(filtered); // Update the filtered contacts
  };

  // Toggle modal visibility
  const toggleModal = () => {
    setShowModal(!showModal);
    setErrorMessage(''); // Clear error message when opening or closing modal
  };

  // Handle submit for new contact
  const handleSubmitNewContact = async () => {
    if (isNewGroup) {
      if(!newGroupCode) return;
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/group/groupcode/${newGroupCode}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          setErrorMessage('No group exist');
          return;
        }

        const group = await response.json();
        const groupId = await group._id

        if (group.participant.some(pt => pt == userId)) {
          setErrorMessage('You are already in the group');
          return;
        }

        const resGroup = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/group/${newGroupCode}/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (resGroup.ok) {
          console.log('Group added successfully');

          fetchContacts();
          setNewGroupCode('');
          setShowModal(false);
          setErrorMessage('');
        } else {
          const errorData = await createContactResponse.json();
          setErrorMessage(errorData.message || 'Error adding group');
        }
      }
      catch (error) {
        setErrorMessage('Error adding new group');
        console.error('Error adding new group:', error);
      }
    }
    else {
      if (!newContactUsername) return;
      try {
        // Fetch the contact's userId based on the username
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        // Fetch the user details by username
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/getUserByUsername/${newContactUsername}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          setErrorMessage('Failed to find user by username');
          return;
        }

        const contactUser = await response.json();
        const contactId = contactUser._id;

        // Make API call to create the contact
        const createContactResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/contactBetween/${userId}/${contactId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (createContactResponse.ok) {
          console.log('Contact added successfully');

          fetchContacts(); // Update contacts
          setNewContactUsername('');
          setShowModal(false); // Close the modal after submission
          setErrorMessage(''); // Clear error message after successful contact addition
        } else {
          const errorData = await createContactResponse.json();
          setErrorMessage(errorData.message || 'Error adding contact');
        }
      }
      catch (error) {
        setErrorMessage('Error adding new contact');
        console.error('Error adding new contact:', error);
      }
    }
  };

  // Update the selected contact when a contact is clicked
  const handleContactClick = (item) => {
    if (item.type === 'contact') {
      setSelectedContactId(item.receiver._id); // Set selected contact ID
    } else if (item.type === 'group') {
      setSelectedContactId(item._id); // Set selected group ID
    }
    onContactClick(item); // Call the parent callback
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
            className="text-2xl text-white px-3 py-1"
            onClick={toggleModal}
          >
            +
          </button>
        </div>
      </div>

      {/* My Contacts */}
      {filteredContacts.length > 0 ? (
        <ContactList
          contacts={filteredContacts}
          onContactClick={handleContactClick}
          selectedContactId={selectedContactId} // Pass the selected contact ID
        />
      ) : (
        <p className="text-gray-300 mt-4">No contacts found</p>
      )}

      {/* Modal for adding a new contact */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 rounded-lg p-6 w-1/3">
            {/* <h2 className="text-xl text-white mb-4">Add New Chat</h2> */}

            {/* Toggle Switch between Contact and Group */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-white mb-1">Add {isNewGroup ? 'Group' : 'Contact'}</h2>
              <div className="flex items-center">
                <span className="text-sm text-gray-300 mr-2">Contact</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNewGroup}
                    onChange={() => {
                      setIsNewGroup(!isNewGroup)
                      setErrorMessage('')
                      setNewContactUsername('')
                      setNewGroupCode('')
                    }} // Toggle between contact and group
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-500 rounded-full peer-checked:bg-cyan-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:left-1.5 after:top-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                </label>
                <span className="text-sm text-gray-300 ml-2">Group</span>
              </div>
            </div>

            {/* Username input */}
            <input
              type="text"
              placeholder={isNewGroup ? "Enter Group code" : "Enter username"}
              value={isNewGroup ? newGroupCode : newContactUsername}
              onChange={(e) => (isNewGroup ? setNewGroupCode(e.target.value) : setNewContactUsername(e.target.value))}
              className="w-full p-2 mb-4 bg-gray-700 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />

            {/* Display error message */}
            {errorMessage && (
              <p className="text-red-500 mb-4">{errorMessage}</p>
            )}

            {/* Buttons */}
            <div className="flex justify-end space-x-2">
              {/* Close Button */}
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500"
                onClick={toggleModal}
              >
                Cancel
              </button>

              {/* Submit Button */}
              <button
                className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-500"
                onClick={handleSubmitNewContact}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
