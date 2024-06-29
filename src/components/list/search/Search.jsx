import "./search.css";
import React from "react";
const Search = ({ setSearchTerm }) => {
  const handleSearch = (event) => {
    setSearchTerm(event.target.value); // Update the search term on input change
  };

  return (
    <div className="search">
      <div className="search-box">
        <img src="./images/search.png" alt="" />
        <input
          type="text"
          placeholder="Search Username ..."
          onChange={handleSearch} // Handle input changes
        />
      </div>
    </div>
  );
};

export default Search;
