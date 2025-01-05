import React, { useState, useEffect } from "react";
import "./Profile.css";
import Header from "../../components/MainHeader";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { confirmAlert } from "react-confirm-alert"; // Import the confirm alert
import "react-confirm-alert/src/react-confirm-alert.css"; // Import the CSS for the confirmation dialog
import {
  getUserDetails,
  updateUserProfile,
  getProductsByUserId,
  updateProfileImageApi,
  deleteProduct,
  getSavedProductsApi,
  deleteSavedProductApi,
} from "../../apis/Api";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const user = JSON.parse(localStorage.getItem("user")); // Retrieve user from localStorage
  const userId = user?._id; // Safely extract userId

  const [activeTab, setActiveTab] = useState("Ad Posts"); // Default active tab
  const [activeFilter, setActiveFilter] = useState("All"); // Default active filter
  const [isEditing, setIsEditing] = useState(false); // Toggle between edit and view mode
  const [userData, setUserData] = useState(null); // State to store user data
  const [userProducts, setUserProducts] = useState([]); // State for user products
  const [savedProducts, setSavedProducts] = useState([]); // State for saved products
  const [openMenu, setOpenMenu] = useState(null); // Add this with other state declarations
  const [isLoadingUser, setIsLoadingUser] = useState(true); // Loading state for user details
  const [isLoadingProducts, setIsLoadingProducts] = useState(true); // Loading state for products

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (!userId) {
          throw new Error("User ID not found in localStorage.");
        }

        const response = await getUserDetails(userId);
        console.log("Fetched user data:", response.data.user);
        setUserData(response.data.user);
        // Update localStorage with fetched user data
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } catch (error) {
        console.error("Error fetching user details:", error);
        setUserData(null);
      } finally {
        setIsLoadingUser(false); // Ensure loading is stopped
      }
    };

    const fetchUserProducts = async () => {
      try {
        if (!userId) {
          throw new Error("User ID not found in localStorage.");
        }

        const productsResponse = await getProductsByUserId(userId);
        console.log("Fetched products:", productsResponse.products);
        setUserProducts(productsResponse.products || []); // Ensure default empty array
      } catch (error) {
        console.error("Error fetching products:", error);
        setUserProducts([]); // Ensure no products
      } finally {
        setIsLoadingProducts(false); // Ensure loading is stopped
      }
    };

    fetchUserDetails();
    fetchUserProducts();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideClick = !event.target.closest(".menu-container");

      if (isOutsideClick) {
        setOpenMenu(null);
      }
    };

    if (openMenu !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  // Add these functions after your other state declarations
  const handleMarkAsSold = (productId) => {
    setUserProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId ? { ...product, status: "Sold" } : product
      )
    );
    setOpenMenu(null); // Close menu after action
  };

  const handleHold = (productId) => {
    setUserProducts((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId ? { ...product, status: "Hold" } : product
      )
    );
    setOpenMenu(null); // Close menu after action
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleUpdate = (product) => {
    console.log("Navigating to update page for product:", product); // Debug log
    try {
      navigate(`/updateproduct/${product._id}`, {
        state: {
          product: product,
        },
      });
    } catch (error) {
      console.error("Error navigating to update page:", error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProduct(productId);
      setUserProducts(
        userProducts.filter((product) => product._id !== productId)
      );
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Error deleting product. Please try again.");
    }
  };

  const confirmDelete = (productId) => {
    confirmAlert({
      title: "Confirm to delete",
      message: "Are you sure you want to delete this product?",
      buttons: [
        {
          label: "Yes",
          onClick: () => handleDelete(productId),
        },
        {
          label: "No",
          onClick: () => {},
        },
      ],
    });
  };

  const toggleMenu = (productId) => {
    setOpenMenu((prevMenu) => (prevMenu === productId ? null : productId));
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const filteredProducts =
    activeFilter === "All"
      ? userProducts
      : userProducts.filter((product) => product.status === activeFilter);

  const handleUpdateClick = async () => {
    try {
      console.log("Updating userData:", userData); // Debug log
      if (!userData || !userData._id) {
        throw new Error("User ID is missing.");
      }

      const updatedData = await updateUserProfile(userData._id, userData);
      console.log("Updated data from backend:", updatedData);

      // Refetch the updated user data
      const response = await getUserDetails(userData._id);
      setUserData(response.data.user);

      localStorage.setItem("user", JSON.stringify(response.data.user));

      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) {
        throw new Error("Please select an image.");
      }

      const response = await updateProfileImageApi(userId, file);
      console.log("Profile image updated:", response);

      const updatedUser = { ...userData, profileImage: response.profileImage };
      setUserData(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      console.error("Error uploading profile image:", error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true); // Switch to edit mode
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Navigate to product details page
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchSavedProducts = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user")); // Get logged-in user
        if (user && user._id) {
          const response = await getSavedProductsApi(user._id); // Fetch saved products
          setSavedProducts(response.savedProducts || []); // Update state with saved products
        }
      } catch (error) {
        console.error("Error fetching saved products:", error);
      }
    };

    fetchSavedProducts();
  }, []);

  const handleDeleteSavedProduct = async (productId) => {
    try {
      const response = await deleteSavedProductApi({
        userId: userId, // Current user's ID
        productId, // Product to be removed
      });
      console.log("Product removed from saved list:", response);
      toast.success("Product removed from saved list!");

      // Update the local state to reflect the changes
      setSavedProducts((prevSavedProducts) =>
        prevSavedProducts.filter((product) => product._id !== productId)
      );
    } catch (error) {
      console.error("Error removing product from saved list:", error);
      toast.error(
        "Failed to remove product from saved list. Please try again."
      );
    }
  };

  if (isLoadingUser) {
    return <p>Loading user details...</p>;
  }

  if (!userData) {
    return <p>Error: User data could not be loaded.</p>;
  }

  return (
    <div className="profile-container">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="profile-main">
        {isEditing ? (
          <div className="profile-edit">
            <h2>Edit Profile</h2>
            <div className="profile-photo-section">
              <div className="profile-photo">
                {userData.profileImage ? (
                  <img
                    src={`http://localhost:3030/public/profiles/${userData.profileImage}`}
                    alt="Profile"
                    className="profile-photo-img"
                  />
                ) : (
                  <i className="fas fa-user-circle profile-placeholder-icon"></i>
                )}
              </div>
              <label className="profile-photo-button">
                Change Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
              </label>
            </div>
            <form>
              <label>Full Name</label>
              <input
                type="text"
                name="fullname"
                value={userData.fullname || ""}
                onChange={handleInputChange}
                className="profile-input"
              />
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={userData.email || ""}
                onChange={handleInputChange}
                className="profile-input"
              />
              <label>Date of Birth</label>
              <input
                type="date"
                name="dateOfBirth"
                value={userData.dateOfBirth?.split("T")[0] || ""}
                onChange={handleInputChange}
                className="profile-input"
              />
              <label>Province</label>
              <select
                name="province"
                value={userData.province || ""}
                onChange={handleInputChange}
                className="profile-input"
              >
                <option value="">Select Province</option>
                <option value="Province 1">Province 1</option>
                <option value="Province 2">Province 2</option>
                <option value="Bagmati">Bagmati</option>
                <option value="Gandaki">Gandaki</option>
              </select>
              <label>Phone Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={userData.phoneNumber || ""}
                onChange={handleInputChange}
                className="profile-input"
              />
              <button
                className="profile-update-button"
                type="button"
                onClick={handleUpdateClick}
              >
                Update Profile
              </button>
            </form>
          </div>
        ) : (
          <div className="profile-view">
            <div className="profile-photo-section">
              {userData.profileImage ? (
                <img
                  src={`http://localhost:3030/public/profiles/${userData.profileImage}`}
                  alt="Profile"
                  className="profile-photo-img"
                />
              ) : (
                <i className="fas fa-user-circle profile-placeholder-icon"></i>
              )}
            </div>
            <h3>{userData.fullname}</h3>
            <p>{userData.email}</p>
            <p>{userData.phoneNumber}</p>
            <p>{userData.province}</p>
            <button
              className="profile-edit-button"
              type="button"
              onClick={handleEditClick}
            >
              Edit Profile
            </button>
          </div>
        )}

        {/* Ad Posts and Save List Section */}
        <div className="profile-content">
          <div className="profile-content-header">
            <h2
              className={activeTab === "Ad Posts" ? "active" : ""}
              onClick={() => handleTabClick("Ad Posts")}
            >
              Ad Posts
            </h2>
            <h2
              className={activeTab === "Save Lists" ? "active" : ""}
              onClick={() => handleTabClick("Save Lists")}
            >
              Save Lists
            </h2>
          </div>
          <div className="profile-content-search-container">
            <input
              type="text"
              placeholder="Search Product"
              className="profile-content-search"
            />
          </div>

          <div className="profile-content-filters">
            <button
              className={`profile-filter-button ${
                activeFilter === "All" ? "active" : ""
              }`}
              onClick={() => handleFilterClick("All")}
            >
              All
            </button>
            <button
              className={`profile-filter-button ${
                activeFilter === "Hold" ? "active" : ""
              }`}
              onClick={() => handleFilterClick("Hold")}
            >
              Hold
            </button>
            <button
              className={`profile-filter-button ${
                activeFilter === "Sold" ? "active" : ""
              }`}
              onClick={() => handleFilterClick("Sold")}
            >
              Sold
            </button>
          </div>
          {activeTab === "Ad Posts" && (
            <div className="profile-ad-posts">
              {isLoadingProducts ? (
                <p>Loading products...</p>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div
                    className="profile-ad-card"
                    key={product._id}
                    onClick={(event) => {
                      // Only navigate if menu is closed
                      if (!openMenu) {
                        handleProductClick(product._id);
                      }
                    }}
                  >
                    {product.status && (
                      <div className="status-badge">{product.status}</div>
                    )}

                    <div className="menu-container">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleMenu(product._id);
                        }}
                        className="menu-dots"
                      >
                        ⋮
                      </button>
                      {openMenu === product._id && (
                        <div className="menu-popup">
                          <div
                            className="menu-item"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleMarkAsSold(product._id);
                              setOpenMenu(null);
                            }}
                          >
                            <span className="menu-icon">👁️</span>
                            Mark as Sold
                          </div>
                          <div
                            className="menu-item"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleHold(product._id);
                              setOpenMenu(null);
                            }}
                          >
                            <span className="menu-icon">⏸️</span>
                            Hold Ad
                          </div>
                          <div
                            className="menu-item"
                            onClick={(event) => {
                              event.stopPropagation();

                              confirmDelete(product._id);
                              setOpenMenu(null);
                              // Add delete functionality
                            }}
                          >
                            <button className="menu-icon">🗑️</button>
                            Delete Ad
                          </div>
                          <div
                            className="menu-item"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleUpdate(product); // Trigger navigation
                              setOpenMenu(null);
                            }}
                          >
                            <button className="menu-icon">✏️</button>
                            Edit Ad
                          </div>
                        </div>
                      )}
                    </div>
                    <img
                      src={`http://localhost:3030/public/products/${product.productImage}`}
                      alt={product.productName}
                      className="profile-ad-image"
                    />
                    <h3>{product.productName}</h3>
                    <p>{product.productCondition}</p>
                    <p>Rs. {product.productPrice}</p>
                  </div>
                ))
              ) : (
                <p>No products found.</p>
              )}
            </div>
          )}
          {activeTab === "Save Lists" && (
            <div className="profile-save-lists">
              {savedProducts.length > 0 ? (
                savedProducts.map((product) => (
                  <div
                    className="profile-ad-card"
                    key={product._id}
                    onClick={(event) => {
                      // Only navigate if menu is closed
                      if (!openMenu) {
                        handleProductClick(product._id);
                      }
                    }}
                  >
                    {product.status && (
                      <div className="status-badge">{product.status}</div>
                    )}

                    <div className="menu-container">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleMenu(product._id);
                        }}
                        className="menu-dots"
                      >
                        ⋮
                      </button>
                      {openMenu === product._id && (
                        <div className="menu-popup">
                          <div
                            className="menu-item"
                            onClick={(event) => {
                              event.stopPropagation();

                              handleDeleteSavedProduct(product._id);
                              setOpenMenu(null);
                              // Add delete functionality
                            }}
                          >
                            <button className="menu-icon">🗑️</button>
                            Delete Ad
                          </div>
                        </div>
                      )}
                    </div>
                    <img
                      src={`http://localhost:3030/public/products/${product.productImage}`}
                      alt={product.productName}
                      className="profile-ad-image"
                    />
                    <h3>{product.productName}</h3>
                    <p>{product.productCondition}</p>
                    <p>Rs. {product.productPrice}</p>
                  </div>
                ))
              ) : (
                <p>No saved products found.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
