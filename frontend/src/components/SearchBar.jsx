const SearchBar = ({ onSearch }) => {
    const handleInputChange = (e) => {
      onSearch(e.target.value); // Call the search function provided by the parent
    };
  
    return (
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Contact or Group"
          onChange={handleInputChange} 
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>
    );
  };
  
  export default SearchBar;
  