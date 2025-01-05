import React, { useState, useEffect } from "react";
import Header from "../../components/MainHeader";
import { useParams } from "react-router-dom"; // Import useParams
import ChatPopup from "../chatpage/ChatPopup";
import { Star, MessageCircle, ThumbsUp } from "lucide-react";
import {
  getUserDetails,
  getProductById,
  createComment,
  replyComment,
  getCommentsApi,
  getSimilarProductsApi,
  saveProductApi,
} from "../../apis/Api"; // Adjust the import path to your API file
import "./Productpage.css";
import { toast } from "react-toastify";

const Product = () => {
  const { productId } = useParams(); // Get productId from route
  const [product, setProduct] = useState(null);
  const [seller, setSeller] = useState(null);
  const [comments, setComments] = useState([]); // Default to an empty array
  const [localReplies, setLocalReplies] = useState({}); // Temporarily store replies
  const [similarProducts, setSimilarProducts] = useState([]); // Default to an empty array
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (!productId) return; // Ensure productId exists
    console.log(productId);

    const fetchProductData = async () => {
      try {
        // Fetch product details
        const productData = await getProductById(productId);
        setProduct(productData.product);

        // Fetch seller details
        const sellerData = await getUserDetails(productData.product?.createdBy);
        console.log("Seller Data:", sellerData.data.user); // Log the user object
        setSeller(sellerData.data.user); // Set the user object to the state

        // Fetch comments
        const commentsData = await getCommentsApi(productId);
        setComments(commentsData.comment || []); // Default to an empty array
        console.log("Fetched Product Data:", commentsData);
        console.log("Updated comments state:", comment);

        // Fetch similar products
        const similarProductsData = await getSimilarProductsApi(
          productData.product?.productCategory
        );
        console.log("Similar Products Data:", similarProductsData);
        setSimilarProducts(similarProductsData.product || []); // Default to an empty array
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [productId]);

  useEffect(() => {
    console.log("Comments State Updated:", comment); // Debugging log
  }, [comment]); // Log comments whenever the state changes

  useEffect(() => {
    console.log("Updated Similar Products State:", similarProducts);
  }, [similarProducts]);

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      console.warn("Comment cannot be empty.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user data
    if (!user || !user._id) {
      console.warn("User not logged in.");
      return;
    }

    const newComment = {
      author: user._id,
      authorName: user.fullname,
      content: comment, // Use "content" as expected by the backend
      rating,
      postId: productId,
    };

    console.log("Payload:", newComment);

    try {
      const response = await createComment(newComment);
      setComments([response.comment, ...comments]);
      setComment(""); // Reset comment input
      setRating(0); // Reset rating
    } catch (error) {
      console.error(
        "Error submitting comment:",
        error.response?.data || error.message
      );
    }
  };

  const handleReplySubmit = (commentId) => {
    if (!replyText.trim()) {
      console.warn("Reply cannot be empty.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user")); // Retrieve user details
    if (!user || !user._id) {
      console.warn("User not logged in.");
      return;
    }

    const replyData = {
      author: user._id,
      authorName: user.fullname,
      content: replyText,
      createdAt: new Date().toISOString(),
    };

    // Update local replies
    setLocalReplies((prevReplies) => ({
      ...prevReplies,
      [commentId]: [...(prevReplies[commentId] || []), replyData],
    }));

    setReplyText(""); // Reset reply input
    setReplyingTo(null); // Close the reply box
  };

  const handleSaveProduct = async () => {
    const user = JSON.parse(localStorage.getItem("user")); // Get the logged-in user
    if (!user || !user._id) {
      navigate("/login"); // Redirect to login if not logged in
      return;
    }

    try {
      const response = await saveProductApi({
        userId: user._id,
        productId: productId, // ID of the product being saved
      });
      console.log("Product saved successfully:", response);
      toast.success("Product saved successfully!");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product. Please try again.");
    }
  };

  return (
    <div className="product-container">
      <Header />

      <div className="product-main">
        <div className="product-details">
          {product && (
            <div className="product-image-section">
              <img
                src={`http://localhost:3030/public/products/${product?.productImage}`}
                alt="Product"
                className="product-image"
              />
              <p className="product-price">Rs {product?.productPrice}</p>
              <p className="product-condition">{product?.productCondition}</p>
              {seller && (
                <div className="userseller-info">
                  <p>
                    <strong>{seller?.fullname}</strong>
                  </p>
                  <p>{seller?.phoneNumber}</p>
                </div>
              )}
              <div className="action-buttons">
                <button className="save-btn" onClick={handleSaveProduct}>
                  Save
                </button>
                <button
                  className="chat-btn"
                  onClick={() => setIsChatOpen(true)}
                >
                  Chat Now
                </button>
              </div>
              <p className="recommendation-note">
                Note: We recommend you to physically inspect the product/service
                before making payment. Avoid paying fees or advance payment to
                sellers.
              </p>
            </div>
          )}
        </div>

        <div className="product-info-section">
          {product && (
            <>
              <h2>{product?.productName}</h2>
              <p className="product-description">
                {product?.productDescription}
              </p>
              <h3>General</h3>
              <div className="product-general-info">
                <p>
                  <strong>Location:</strong> {product?.productLocation}
                </p>
                <p>
                  <strong>Delivery:</strong>{" "}
                  {product?.productDelivery ? "Available" : "Not Available"}
                </p>
                <p>
                  <strong>Negotiable:</strong>{" "}
                  {product?.productNegotiable ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Category:</strong> {product?.productCategory}
                </p>
                <p>
                  <strong>Ads Posted:</strong> {product?.createdAt}
                </p>
              </div>
            </>
          )}

          <div className="comments-section">
            <h3 className="comments-title">Rate & Comment</h3>

            <div className="rating-section">
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className="star-btn"
                  >
                    <Star
                      size={24}
                      className={star <= rating ? "star-filled" : "star-empty"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="comment-input-section">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this product..."
                className="comment-box"
              />
              <button onClick={handleCommentSubmit} className="comment-button">
                Post Comment
              </button>
            </div>

            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map((comment, commentIndex) => (
                  <div
                    key={comment._id || comment.id || `comment-${commentIndex}`}
                    className="comment-card"
                  >
                    {/* Render comment details */}
                    <div className="comment-header">
                      <div className="comment-user-info">
                        <div className="user-avatar">
                          {comment.userImage ? (
                            <img
                              src={`http://localhost:3030/public/profiles/${comment.userImage}`}
                              alt={comment.authorName || "Anonymous"}
                              className="user-avatar-img"
                            />
                          ) : (
                            <span>{comment.authorName?.charAt(0) || "?"}</span>
                          )}
                        </div>
                        <span className="user-name">
                          {comment.authorName || "Anonymous"}
                        </span>
                        <span className="comment-time">
                          {comment.createdAt
                            ? new Date(comment.createdAt).toLocaleString()
                            : "Unknown Date"}
                        </span>
                      </div>
                    </div>
                    <p className="comment-text">{comment.content}</p>
                    <div className="comment-actions">
                      <button className="action-btn">
                        <ThumbsUp size={16} />
                        <span>{comment.likes || 0}</span>
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => setReplyingTo(comment._id)}
                      >
                        <MessageCircle size={16} />
                        <span>Reply</span>
                      </button>
                    </div>
                    {/* Render Local Replies */}
                    {Array.isArray(localReplies[comment._id]) &&
                      localReplies[comment._id].map((reply, replyIndex) => (
                        <div key={`reply-${replyIndex}`} className="reply-card">
                          <div className="reply-header">
                            <div className="reply-user-info">
                              <div className="user-avatar">
                                {reply.userImage ? (
                                  <img
                                    src={`http://localhost:3030/public/profiles/${reply.userImage}`}
                                    alt={reply.authorName}
                                    className="user-avatar-img"
                                  />
                                ) : (
                                  <span>
                                    {reply.authorName?.charAt(0) || "?"}
                                  </span>
                                )}
                              </div>
                              <span className="user-name">
                                {reply.authorName || "Anonymous"}
                              </span>
                              <span className="reply-time">
                                {reply.createdAt
                                  ? new Date(reply.createdAt).toLocaleString()
                                  : "Unknown Date"}
                              </span>
                            </div>
                          </div>
                          <p className="reply-text">{reply.content}</p>
                        </div>
                      ))}

                    {/* Render Replies */}
                    {/* {Array.isArray(comment.replies) &&
                      comment.replies.map((reply, replyIndex) => (
                        <div
                          key={reply._id || reply.id || `reply-${replyIndex}`}
                          className="reply-card"
                        >
                          <div className="reply-header">
                            <div className="reply-user-info">
                              <div className="user-avatar">
                                {reply.userImage ? (
                                  <img
                                    src={`http://localhost:3030/public/profiles/${reply.userImage}`}
                                    alt={reply.authorName}
                                    className="user-avatar-img"
                                  />
                                ) : (
                                  <span>
                                    {reply.authorName?.charAt(0) || "?"}
                                  </span>
                                )}
                              </div>
                              <span className="user-name">
                                {reply.authorName || "Anonymous"}
                              </span>
                              <span className="reply-time">
                                {reply.createdAt
                                  ? new Date(reply.createdAt).toLocaleString()
                                  : "Unknown Date"}
                              </span>
                            </div>
                          </div>
                          <p className="reply-text">
                            {reply.content || "No content provided."}
                          </p>
                        </div>
                      ))} */}

                    {/* Render Reply Input Box Below the Comment */}
                    {replyingTo === comment._id && (
                      <div className="reply-input">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          className="reply-box"
                        />
                        <div className="reply-buttons">
                          <button
                            onClick={() => handleReplySubmit(comment._id)}
                            className="reply-submit-btn"
                          >
                            Submit
                          </button>
                          <button
                            onClick={() => setReplyingTo(null)}
                            className="reply-cancel-btn"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="similar-products">
          <h3>Similar Products</h3>
          {similarProducts.length > 0 ? (
            similarProducts.map((product) => (
              <div key={product?._id} className="similar-product-card">
                <img
                  src={`http://localhost:3030/public/products/${product.productImage}`}
                  alt={product?.productName}
                  className="similar-product-image"
                />
                <p>{product?.productName}</p>
                <p>{product.productCondition}</p>
                <p>Rs {product?.productPrice}</p>
              </div>
            ))
          ) : (
            <p>No similar products found.</p>
          )}
          <footer className="footer">
            <a href="#about">About us</a>
            <a href="#contact">Contact</a>
          </footer>
        </div>
      </div>
      <ChatPopup
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        seller={seller}
        userId={JSON.parse(localStorage.getItem("user"))?._id || null} // Pass the current user's ID
        productId={productId} // Pass the product ID
      />
    </div>
  );
};

export default Product;
