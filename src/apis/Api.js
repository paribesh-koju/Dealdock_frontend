import axios from "axios";

const API_URL = "http://localhost:3030"; // Your backend API URL

// Function to get authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/users/register`,
      userData
    );
    return response; // Return the full response
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Login a user
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/login`, userData);
    return response; // Return the full response
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/products/create`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authorization header
        },
      }
    );
    return response; // Return the full response
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Get user details
export const getUserDetails = async (id) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/users/get_user/${id}`,
      getAuthHeaders()
    );
    return response;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (id, userData) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/users/update_user/${id}`,
      userData,
      getAuthHeaders()
    );
    return response; // Return the full response
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};

// Fetch all products by user ID
export const getProductsByUserId = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const response = await axios.get(
      `${API_URL}/api/products/get_products_by_user_id/${userId}`,
      getAuthHeaders()
    );

    return response.data; // Return the fetched products
  } catch (error) {
    console.error("Error fetching products by user ID:", error);
    throw error;
  }
};

export const updateProfileImageApi = async (id, profileImage) => {
  try {
    const formData = new FormData();
    formData.append("profileImage", profileImage);

    const response = await axios.post(
      `${API_URL}/api/users/update_profile_image/${id}`,
      formData,
      {
        headers: {
          ...getAuthHeaders().headers,
          "Content-Type": "multipart/form-data", // Ensure the proper content type
        },
      }
    );

    return response.data; // Return the response data
  } catch (error) {
    console.error("Error updating profile image:", error);
    throw error;
  }
};

// Fetch a single product by its ID
export const getProductById = async (productId) => {
  try {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    const response = await axios.get(
      `${API_URL}/api/products/get_single_product/${productId}`,
      getAuthHeaders()
    );

    return response.data; // Return the fetched product data
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

// Create a new comment
export const createComment = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/comment/create_comment`,
      data,
      getAuthHeaders() // Include authorization headers if needed
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

// Reply to a comment
export const replyComment = async (data, id) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/comment/reply_comment/${id}`,
      data,
      getAuthHeaders() // Include authorization headers if needed
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error replying to comment:", error);
    throw error;
  }
};

// Get comments for a post
export const getCommentsApi = async (postId) => {
  try {
    if (!postId) {
      throw new Error("Post ID is required");
    }

    const response = await axios.get(
      `${API_URL}/api/comment/get_comments/${postId}`,
      getAuthHeaders() // Include authorization headers if needed
    );
    return response.data; // Return the fetched comments
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

// Get replies for specific comment IDs
export const getReplies = async (ids) => {
  try {
    if (!ids || ids.length === 0) {
      throw new Error("Comment IDs are required");
    }

    const response = await axios.post(
      `${API_URL}/api/comment/get_replies/`,
      { ids },
      getAuthHeaders() // Include authorization headers if needed
    );
    return response.data; // Return the fetched replies
  } catch (error) {
    console.error("Error fetching replies:", error);
    throw error;
  }
};

// Fetch similar products by category
export const getSimilarProductsApi = async (category) => {
  try {
    if (!category) {
      throw new Error("Category is required");
    }

    const response = await axios.get(
      `${API_URL}/api/products/get_similar_products/${category}`,
      getAuthHeaders() // Include authorization headers if needed
    );

    return response.data; // Return the fetched similar products
  } catch (error) {
    console.error("Error fetching similar products:", error);
    throw error;
  }
};

// Fetch all products
export const getAllProductsApi = async () => {
  try {
    const response = await axios.get(
      `${API_URL}/api/products/get_all_products`,
      getAuthHeaders()
    );
    return response.data; // Return the fetched products
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
};

//create a message
export const createMessageApi = async (messageData) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/messages/create`,
      messageData,
      getAuthHeaders() // Include authorization headers if needed
    );
    return response.data; // Return the created message
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
};

//get a message
export const getMessagesApi = async (chatRoomId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/messages/${chatRoomId}`,
      getAuthHeaders() // Include authorization headers if needed
    );
    return response.data; // Return the fetched messages
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

// mark messages as read
export const markMessagesReadApi = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/messages/mark-read`,
      data,
      getAuthHeaders() // Include authorization headers if needed
    );
    return response.data; // Return the response
  } catch (error) {
    console.error("Error marking messages as read:", error);
    throw error;
  }
};

// Get unread message counts
export const getUnreadCountsApi = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/messages/unread/${userId}`,
      getAuthHeaders() // Include authorization headers if needed
    );
    return response.data; // Return unread counts
  } catch (error) {
    console.error("Error fetching unread counts:", error);
    throw error;
  }
};

// Fetch products by category
export const fetchProductsByCategoryApi = async (category) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/products/category/${category}`
    );
    return response.data; // Return the array of products
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error; // Re-throw to handle errors in the calling function
  }
};

// Update a product
export const updateProduct = async (productId, productData) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/products/update_product/${productId}`,
      productData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Add authorization header
        },
      }
    );
    return response; // Return the full response
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (productId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/products/delete_product/${productId}`,
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// Save a product
export const saveProductApi = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/users/saveProduct`, // Endpoint for saving product
      data, // { userId, productId }
      getAuthHeaders() // Include authorization headers
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error saving product:", error);
    throw error;
  }
};

// Fetch saved products
export const getSavedProductsApi = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/api/users/getSavedProducts?userId=${userId}`, // Endpoint for fetching saved products
      getAuthHeaders() // Include authorization headers
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error fetching saved products:", error);
    throw error;
  }
};

// Delete a saved product
export const deleteSavedProductApi = async (data) => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/users/deleteSavedProduct`,
      {
        data, // Send { userId, productId } in the request body
        ...getAuthHeaders(),
      }
    );
    return response.data; // Return the updated saved products
  } catch (error) {
    console.error("Error deleting saved product:", error);
    throw error;
  }
};

// Forgot password api
export const forgotPasswordApi = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/users/forgot_password`,
      data
    );
    return response; // Return the full response
  } catch (error) {
    console.error("Error with forgot password:", error);
    throw error;
  }
};

// Verify OTP
export const verifyOtpApi = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/api/users/verify_otp`, data);
    return response; // Return the full response
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};
