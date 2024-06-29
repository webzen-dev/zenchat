import React, { useState } from "react";
import Chatlist from "./chatlist/Chatlist";
import Search from "./search/Search";
import "./list.css";

const List = () => {
  const [searchTerm, setSearchTerm] = useState(""); // State to manage the search term

  return (
    <div className="list">
      <Search setSearchTerm={setSearchTerm} /> {/* Pass the setSearchTerm function to Search */}
      <Chatlist searchTerm={searchTerm} /> {/* Pass the searchTerm to Chatlist */}
    </div>
  );
};

export default List;