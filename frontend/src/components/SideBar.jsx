// SideBar.js
import React, { useState, useEffect } from 'react';
import ContactList from "./ContactList";
import SearchBar from "./SearchBar";

const SideBar = ({ onContactClick }) => {
  const [contacts, setContacts] = useState([]); // Store fetched contacts
  const [filteredContacts, setFilteredContacts] = useState([]); // Store filtered contacts
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem('token'); 
        const userId = localStorage.getItem('userId'); 
        const response = await fetch(`http://localhost:3000/api/user/${userId}/contacts`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
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

    fetchContacts();
  }, []); 

  // Function to handle the search input
  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm); // Update the search term

    // Filter contacts based on the search term
    const filtered = contacts.filter(contact =>
      contact.receiver.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered); // Update the filtered contacts
  };

  return (
    <div className="w-1/4 bg-gray-900 border-r border-gray-800 p-4 flex flex-col justify-between">
      <div>
        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* My Contacts */}
        <ContactList contacts={filteredContacts} onContactClick={onContactClick} />
      </div>
      <div>
        {/* New Group Button */}
        <button className="mt-6 w-full flex items-center justify-center bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-500 transition duration-300">
          New Group Chat +
        </button>
        <button className="mt-6 w-full flex items-center justify-center bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-500 transition duration-300">
          Create Group Chat +
        </button>
      </div>
    </div>
  );
};

export default SideBar;
