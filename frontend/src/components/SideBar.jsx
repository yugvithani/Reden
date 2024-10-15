import ContactList from "./ContactList";
import SearchBar from "./SearchBar";

const SideBar = () => {
    return (
        <>
            <div className="w-1/4 bg-gray-900 border-r border-gray-800 p-4 flex flex-col justify-between">
                <div>
                    {/* Search Bar */}
                    <SearchBar/>

                    {/* My Contacts */}
                    <ContactList/>
                    
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
        </>
    );
};

export default SideBar;