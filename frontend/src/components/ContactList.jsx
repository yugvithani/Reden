import React from 'react';

const ContactList = ({ contacts, onContactClick, selectedContactId }) => {
  return (
    <ul className="flex-grow overflow-y-auto">
      {contacts.map((contact) => {
        const isSelected = contact.receiver._id === selectedContactId; // Check if this contact is selected

        return (
          <li
            key={contact.receiver._id}
            onClick={() => onContactClick(contact)} // Handle contact click
            className={`p-4 cursor-pointer rounded-lg transition-colors duration-300 mb-2
              ${isSelected ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {/* Display profile picture or default avatar */}
                <img
                  className="w-10 h-10 rounded-full"
                  src={contact.receiver.profilePicture ? `http://localhost:3000${contact.receiver.profilePicture}` : 'https://via.placeholder.com/40'}
                  alt={`${contact.receiver.username}'s avatar`}
                />
              </div>
              <div className="ml-3">
                <p className="text-l font-medium">{contact.receiver.username}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ContactList;
