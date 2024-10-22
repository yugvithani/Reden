import React from 'react';

const ContactList = ({ contacts, onContactClick, selectedContactId }) => {
  return (
    <ul className="flex-grow overflow-y-auto">
      {contacts.map((item) => {
        const isSelected = selectedContactId === (item.type === 'contact' ? item.receiver._id : item._id); // Check if this contact is selected

        return (
          <li
            key={item.type === 'contact' ? item.receiver._id : item._id}
            onClick={() => onContactClick(item)} // Handle contact click
            className={`p-4 cursor-pointer rounded-lg transition-colors duration-300 mb-2
              ${isSelected ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            {item.type === 'contact' ? (
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {/* Display profile picture or default avatar */}
                <img
                  className="w-10 h-10 rounded-full"
                  src={item.receiver.profilePicture ? `${import.meta.env.VITE_API_BASE_URL}${item.receiver.profilePicture}` : 'https://via.placeholder.com/40'}
                  alt={`${item.receiver.username}'s avatar`}
                />
              </div>
              <div className="ml-3">
                <p className="text-l font-medium">{item.receiver.username}</p>
              </div>
            </div>
            ) : (
              <div className="ml-3">
                <p className="text-l font-medium">{item.name}</p>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

export default ContactList;
