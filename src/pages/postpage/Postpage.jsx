import React, { useState, useRef } from "react";
import { createProduct } from "../../apis/Api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../postpage/Postpage.css";

const Postpage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user._id : null;

  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productCondition, setProductCondition] = useState("");
  const [productNegotiable, setProductNegotiable] = useState("");
  const [productLocation, setProductLocation] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProductImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (
      !productName ||
      !productPrice ||
      !productDescription ||
      !productCategory ||
      !productCondition ||
      !productLocation ||
      !productImage
    ) {
      toast.error("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("productDescription", productDescription);
    formData.append("productCategory", productCategory);
    formData.append("productPrice", productPrice);
    formData.append("productLocation", productLocation);
    formData.append("productNegotiable", productNegotiable);
    formData.append("productCondition", productCondition);
    formData.append("productImage", productImage);
    formData.append("createdBy", userId);

    setIsSubmitting(true);

    try {
      const response = await createProduct(formData);
      toast.success(response.message || "Product added successfully!");

      setTimeout(() => {
        window.location.reload();
      }, 800);

      // Close the modal
      const modalElement = modalRef.current;
      if (modalElement) {
        const bootstrapModal = new window.bootstrap.Modal(modalElement);
        bootstrapModal.hide();
      }

      // Clear the form
      setProductName("");
      setProductDescription("");
      setProductCategory("");
      setProductCondition("");
      setProductNegotiable("");
      setProductLocation("");
      setProductPrice("");
      setProductImage(null);
      setPreviewImage(null);
    } catch (error) {
      toast.error(error.message || "Failed to create the product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Create New Post
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-1">
                <label className="form-label">Post Title</label>
                <input
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  type="text"
                  className="form-control shadow"
                  placeholder="Enter product title"
                />
              </div>
              <div className="mb-1">
                <label className="form-label">Price</label>
                <input
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  type="number"
                  className="form-control shadow"
                  placeholder="Enter price"
                />
              </div>
              <div className="mb-1">
                <label className="form-label">Location</label>
                <input
                  value={productLocation}
                  onChange={(e) => setProductLocation(e.target.value)}
                  type="text"
                  className="form-control shadow"
                  placeholder="Enter location"
                />
              </div>
              <div className="mb-1">
                <label className="form-label">Description</label>
                <textarea
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="form-control shadow"
                  rows="3"
                  placeholder="Describe your product"
                ></textarea>
              </div>
              <div className="mt-1">
                <label className="form-label">Select Category</label>
                <select
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="form-control shadow"
                >
                  <option value="">Select Category</option>
                  <option value="Apparels & Accessories">
                    Apparels & Accessories
                  </option>
                  <option value="Automobiles">Automobiles</option>
                  <option value="Beauty & Health">Beauty & Health</option>
                  <option value="Books & Learning">Books & Learning</option>
                  <option value="Business & Industrial">
                    Business & Industrial
                  </option>
                  <option value="Computers & Peripherals">
                    Computers & Peripherals
                  </option>
                  <option value="Electronics, TVs, & More">
                    Electronics, TVs, & More
                  </option>
                  <option value="Fresh Veggies & Meat">
                    Fresh Veggies & Meat
                  </option>
                  <option value="Furnishings & Appliances">
                    Furnishings & Appliances
                  </option>
                  <option value="Mobile Phones & Accessories">
                    Mobile Phones & Accessories
                  </option>
                  <option value="Sports & Fitness">Sports & Fitness</option>
                </select>
              </div>
              <div className="mt-1">
                <label className="form-label">Condition</label>
                <select
                  value={productCondition}
                  onChange={(e) => setProductCondition(e.target.value)}
                  className="form-control shadow"
                >
                  <option value="">Select Condition</option>
                  <option value="New">New</option>
                  <option value="Likely Old">Likely Old</option>
                </select>
              </div>
              <div className="mt-1">
                <label className="form-label">Negotiable</label>
                <select
                  value={productNegotiable}
                  onChange={(e) => setProductNegotiable(e.target.value)}
                  className="form-control shadow"
                >
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Choose Photo</label>
                <input
                  onChange={handleImageUpload}
                  className="form-control shadow"
                  type="file"
                  accept="image/*"
                />
                {previewImage && (
                  <div className="mt-3">
                    <img
                      src={previewImage}
                      alt="preview"
                      className="img-fluid rounded"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="custom-modal-footer">
              <button
                type="button"
                className="custom-btn-secondary"
                data-bs-dismiss="modal"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                type="button"
                className="custom-btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Posting..." : "Create Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Postpage;
