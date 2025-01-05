import React, { useState, useEffect } from "react";
import "./UpdateProduct.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getProductById, updateProduct } from "../../apis/Api"; // Import API functions
import { useParams, useNavigate } from "react-router-dom";

const UpdateProduct = () => {
  const { productId } = useParams(); // Get productId from URL parameters
  const navigate = useNavigate(); // For navigation after update

  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productLocation, setProductLocation] = useState("");
  const [productNegotiable, setProductNegotiable] = useState("");
  const [productCondition, setProductCondition] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [oldImage, setOldImage] = useState(null);
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await getProductById(productId);
        const product = response.product; // Adjust based on API response
        setProductName(product.productName || "");
        setProductPrice(product.productPrice || "");
        setProductCategory(product.productCategory || "");
        setProductDescription(product.productDescription || "");
        setProductLocation(product.productLocation || "");
        setProductNegotiable(product.productNegotiable || "");
        setProductCondition(product.productCondition || "");
        setOldImage(
          product.productImage
            ? `http://localhost:3030/public/products/${product.productImage}`
            : null
        );
        console.log("State updated with product:", {
          productName,
          productPrice,
          productCategory,
          productDescription,
          productLocation,
          productNegotiable,
          productCondition,
        });
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Error loading product data.");
      }
    };

    loadProduct();
  }, [productId]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProductImage(file);
      setNewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productPrice", productPrice);
    formData.append("productCategory", productCategory);
    formData.append("productDescription", productDescription);
    formData.append("productLocation", productLocation);
    formData.append("productNegotiable", productNegotiable);
    formData.append("productCondition", productCondition);
    if (productImage) {
      formData.append("productImage", productImage);
    }

    try {
      const res = await updateProduct(productId, formData);
      if (res.status === 200) {
        toast.success(res.data.message || "Product updated successfully!");
        navigate("/profile"); // Navigate to dashboard after successful update
      } else {
        toast.error("Unexpected response status");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating product. Please try again.");
    }
  };

  return (
    <div className="update-product-container">
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="productPrice">Product Price</label>
          <input
            type="number"
            id="productPrice"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="productCategory">Product Category</label>
          <select
            id="productCategory"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
            required
          >
            <option value="">Select Category</option>
            <option value="Apparels & Accessories">
              Apparels & Accessories
            </option>
            <option value="Automobiles">Automobiles</option>
            <option value="Beauty & Health">Beauty & Health</option>
            <option value="Books & Learning">Books & Learning</option>
            <option value="Business & Industrial">Business & Industrial</option>
            <option value="Computers & Peripherals">
              Computers & Peripherals
            </option>
            <option value="Electronics, TVs, & More">
              Electronics, TVs, & More
            </option>
            <option value="Fresh Veggies & Meat">Fresh Veggies & Meat</option>
            <option value="Furnishings & Appliances">
              Furnishings & Appliances
            </option>
            <option value="Mobile Phones & Accessories">
              Mobile Phones & Accessories
            </option>
            <option value="Sports & Fitness">Sports & Fitness</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="productImage">Product Image</label>
          <input type="file" id="productImage" onChange={handleImageUpload} />
        </div>
        <div className="image-preview-container">
          {oldImage && (
            <div className="old-image-preview">
              <p>Old Image:</p>
              <img src={oldImage} alt="Old Preview" className="image-preview" />
            </div>
          )}
          {newImage && (
            <div className="new-image-preview">
              <p>New Image:</p>
              <img src={newImage} alt="New Preview" className="image-preview" />
            </div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="productDescription">Product Description</label>
          <textarea
            id="productDescription"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="productLocation">Product Location</label>
          <textarea
            id="productLocation"
            value={productLocation}
            onChange={(e) => setProductLocation(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="productNegotiable">Product Negotiable</label>
          <select
            id="productNegotiable"
            value={productNegotiable}
            onChange={(e) => setProductNegotiable(e.target.value)}
            required
          >
            <option value="">Select Option</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="productCondition">Product Condition</label>
          <select
            id="productCondition"
            value={productCondition}
            onChange={(e) => setProductCondition(e.target.value)}
            required
          >
            <option value="">Select Condition</option>
            <option value="New">New</option>
            <option value="Likely Old">Likely Old</option>
          </select>
        </div>
        <div className="form-buttons">
          <button type="submit" className="update-button">
            Update
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/profile")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
