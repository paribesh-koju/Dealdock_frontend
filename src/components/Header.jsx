import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({ onSearch }) => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handlePostForFree = () => {
    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user data
    if (!user || !user._id) {
      navigate("/login"); // Redirect to login page if the user is not logged in
    } else {
      navigate("/post"); // Navigate to the "Post for free" page if logged in
    }
  };

  const giveSearch = () => {
    console.log(
      "handleSearch triggered in MainHeader with input:",
      searchInput
    ); // Debug log
    if (onSearch && typeof onSearch === "function") {
      onSearch(searchInput); // Pass search query to parent
    } else {
      console.error("Search query:", onSearch);
      console.error("onSearch is not defined or is not a function");
    }
  };
  return (
    <header className="header">
      <div className="header-left">
        <a href="/">
          <img src="/assets/logo.png" alt="DealDock Logo" className="logo" />
        </a>
      </div>
      <div className="header-center">
        <input
          type="text"
          className="search-input"
          placeholder="Search for anything"
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              giveSearch();
            }
          }}
        />
        <button className="search-button" onClick={giveSearch}>
          🔍
        </button>
      </div>
      <div className="header-right">
        <button className="post-button" onClick={handlePostForFree}>
          + Post for free
        </button>
        <button
          className="login-button"
          onClick={() => handleNavigation("/login")}
        >
          Login
        </button>
        <button
          className="signup-button"
          onClick={() => handleNavigation("/signup")}
        >
          Sign Up
        </button>
      </div>
    </header>
  );
};

export default Header;
