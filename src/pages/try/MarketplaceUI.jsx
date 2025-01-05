import React, { useState } from "react";
import { Search, Bell, Plus, Calendar } from "lucide-react";
import "./MarketplaceUI.css";

const MarketplaceUI = () => {
  const [tab, setTab] = useState("saveLists");
  const [filterType, setFilterType] = useState("all");

  const listings = [
    {
      id: 1,
      title: "Toyota Land Cruiser Prado",
      condition: "Like New",
      price: "Rs. 1,55,00,000",
      image: "/api/placeholder/200/150",
    },
    {
      id: 2,
      title: "Honda crf 250L",
      condition: "Like New",
      price: "Rs. 11,50,000",
      image: "/api/placeholder/200/150",
    },
  ];

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <div className="logo">DEALDOCK</div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search for anything"
              className="search-input"
            />
            <Search className="search-icon" size={20} />
          </div>

          <div className="header-right">
            <Bell className="notification-icon" size={24} />
            <button className="post-button">
              <Plus size={20} />
              Post for free
            </button>
            <div className="user-profile">
              <div className="avatar"></div>
              <span>paribesh</span>
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="content-wrapper">
          {/* Profile Edit Section */}
          <div className="profile-section">
            <div className="section-header">
              <h2>Edit Profile</h2>
              <button className="close-button">&times;</button>
            </div>

            <div className="profile-photo">
              <div className="photo-placeholder"></div>
              <span>Change Photo</span>
            </div>

            <form className="profile-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" defaultValue="paribesh koju" />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input type="email" defaultValue="kojuparibesh1234@gmail.com" />
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <div className="date-input">
                  <input type="text" placeholder="dd/mm/yyyy" />
                  <Calendar className="calendar-icon" size={20} />
                </div>
              </div>

              <div className="form-group">
                <label>Province</label>
                <select>
                  <option>Select Province</option>
                </select>
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" defaultValue="9843027096" />
              </div>

              <button type="submit" className="update-button">
                Update Profile
              </button>
            </form>
          </div>

          {/* Listings Section */}
          <div className="listings-section">
            <div className="tabs">
              <button
                className={`tab ${tab === "adPosts" ? "active" : ""}`}
                onClick={() => setTab("adPosts")}
              >
                Ad Posts
              </button>
              <button
                className={`tab ${tab === "saveLists" ? "active" : ""}`}
                onClick={() => setTab("saveLists")}
              >
                Save Lists
              </button>
            </div>

            <div className="filters">
              <div className="product-search">
                <Search className="search-icon" size={20} />
                <input type="text" placeholder="Search Product" />
              </div>

              <div className="filter-buttons">
                {["All", "Hold", "Sold"].map((type) => (
                  <button
                    key={type}
                    className={`filter-button ${
                      filterType === type.toLowerCase() ? "active" : ""
                    }`}
                    onClick={() => setFilterType(type.toLowerCase())}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="listings-grid">
              {listings.map((listing) => (
                <div key={listing.id} className="listing-card">
                  <img src={listing.image} alt={listing.title} />
                  <div className="listing-details">
                    <h3>{listing.title}</h3>
                    <p className="condition">{listing.condition}</p>
                    <p className="price">{listing.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarketplaceUI;
