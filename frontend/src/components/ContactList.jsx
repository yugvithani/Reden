// ContactList.js
import { useState, useEffect } from 'react';

const ContactList = ({ contacts, onContactClick }) => {
  return (
    <>
      <ul className="space-y-2 max-h-[585px] overflow-y-auto pr-3">
        {contacts.length > 0 ? (
          contacts.map((contact) => (
            <li
              key={contact.receiver._id}
              className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer"
              onClick={() => onContactClick(contact)} // Call the onClick function
            >
              {contact.receiver.username}
            </li>
          ))
        ) : (
          <p className="text-gray-500">No contacts found.</p>
        )}
      </ul>
    </>
  );
};

export default ContactList;
