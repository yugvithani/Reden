const ContactList = () => {
    return (
        <>
            <h2 className="text-lg font-semibold mb-3">My Contacts</h2>
            <ul className="space-y-2 max-h-[585px] overflow-y-auto pr-3">
                <li className="bg-cyan-600 p-3 rounded-lg text-white transition-all duration-300 hover:bg-cyan-500">
                    Archit Kandu
                </li>
                <li className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-all duration-300">
                    First Group
                </li>
                <li className="bg-gray-800 p-3 rounded-lg hover:bg-gray-700 transition-all duration-300">
                    Shubham Mishra
                </li>
            </ul>
        </>
    );
};

export default ContactList;