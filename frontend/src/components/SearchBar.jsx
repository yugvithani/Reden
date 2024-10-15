const SearchBar = () => {
    return (
        <>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search User"
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
            </div>
        </>
    );
};

export default SearchBar;