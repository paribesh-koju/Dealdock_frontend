import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import { getAllProductsApi, fetchProductsByCategoryApi } from "../../apis/Api";
import { useNavigate } from "react-router-dom";
import "./Startpage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("latest");
  const [latestProducts, setLatestProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    "Apparels & Accessories",
    "Automobiles",
    "Beauty & Health",
    "Books & Learning",
    "Business & Industrial",
    "Computers & Peripherals",
    "Electronics, TVs, & More",
    "Fresh Veggies & Meat",
    "Furnishings & Appliances",
    "Mobile Phones & Accessories",
    "Sports & Fitness",
  ];

  const shuffleArray = (array) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  const handleProductClick = (productId) => {
    navigate(`/unproduct/${productId}`);
  };

  const handleCategoryClick = async (category) => {
    try {
      setIsLoading(true);
      setSelectedCategory(category);
      const data = await fetchProductsByCategoryApi(category);
      // Log the received data to debug
      console.log("Category products received:", data);
      // Handle both cases where data might be the array itself or nested in a products property
      const productsArray = Array.isArray(data) ? data : data.products || [];
      setCategoryProducts(productsArray);
    } catch (error) {
      console.error("Error fetching category products:", error);
      setCategoryProducts([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getAllProductsApi();
        setLatestProducts(data.products.slice(0, 5));
        setTrendingProducts(shuffleArray(data.products).slice(0, 5));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="homepage">
      <Header />
      <div
        id="carouselExampleCaptions"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="2000"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="0"
            className="active"
            aria-current="true"
            aria-label="Slide 1"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="1"
            aria-label="Slide 2"
          ></button>
          <button
            type="button"
            data-bs-target="#carouselExampleCaptions"
            data-bs-slide-to="2"
            aria-label="Slide 3"
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/assets/first.png" className="d-block w-100" alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <h5>Upto 50% off Product</h5>
              <p>Best quality Products on Market</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src="/assets/good.jpg" className="d-block w-100" alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <h5>Best Services Provider for Loyal Customer</h5>
              <p>Quality is unpredictable</p>
            </div>
          </div>
          <div className="carousel-item">
            <img src="/assets/thrid.jpg" className="d-block w-100" alt="..." />
            <div className="carousel-caption d-none d-md-block">
              <h5>Healtly and fresh Products Available</h5>
              <p>More and more product on presents</p>
            </div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <div className="head">
        <aside className="categories">
          <h3>Category</h3>
          <ul>
            {categories.map((category) => (
              <li
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={selectedCategory === category ? "active" : ""}
                style={{ cursor: "pointer" }}
              >
                {category}
              </li>
            ))}
          </ul>
        </aside>
        <main className="head-content">
          {selectedCategory ? (
            <section className="category-products">
              <h3>{selectedCategory}</h3>
              <div className="products-grid">
                {isLoading ? (
                  <p>Loading...</p>
                ) : categoryProducts.length > 0 ? (
                  categoryProducts.map((product) => (
                    <div
                      className="item"
                      key={product._id || product.id}
                      onClick={() =>
                        handleProductClick(product._id || product.id)
                      }
                    >
                      <img
                        src={
                          product.productImage
                            ? `http://localhost:3030/public/products/${product.productImage}`
                            : "/assets/default-product.png"
                        }
                        alt={product.productName}
                        onError={(e) => {
                          e.target.src = "/assets/default-product.png";
                          e.target.onerror = null;
                        }}
                      />
                      <h4>{product.productName}</h4>
                      <p>{product.productCondition || "New"}</p>
                      <p>
                        Rs.{" "}
                        {product.productPrice?.toLocaleString() ||
                          "Price not available"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No products found in this category</p>
                )}
              </div>
            </section>
          ) : (
            <>
              <section className="top-categories">
                <h3>Top Categories</h3>
                <div className="categories-buttons">
                  {categories.slice(0, 9).map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </section>

              <section className="trending">
                <h3>Trending</h3>
                <div className="trending-items">
                  {isLoading ? (
                    <p>Loading...</p>
                  ) : (
                    trendingProducts.map((product) => (
                      <div
                        className="item"
                        key={product._id}
                        onClick={() => handleProductClick(product._id)}
                      >
                        <img
                          src={`http://localhost:3030/public/products/${product.productImage}`}
                          alt={product.productName}
                        />
                        <h4>{product.productName}</h4>
                        <p>{product.productCondition}</p>
                        <p>Rs. {product.productPrice}</p>
                      </div>
                    ))
                  )}
                </div>
              </section>

              <section className="uploads-sections">
                <div className="uploads-tabs">
                  <button
                    className={`tab ${activeTab === "latest" ? "active" : ""}`}
                    onClick={() => setActiveTab("latest")}
                  >
                    Latest Uploads
                  </button>
                  <button
                    className={`tab ${
                      activeTab === "recommended" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("recommended")}
                  >
                    Recommended
                  </button>
                </div>
                <div className="uploads-content">
                  {activeTab === "latest" && (
                    <div className="latest-uploads">
                      {isLoading ? (
                        <p>Loading...</p>
                      ) : (
                        latestProducts.map((product) => (
                          <div
                            className="upload-item"
                            key={product._id}
                            onClick={() => handleProductClick(product._id)}
                          >
                            <img
                              src={`http://localhost:3030/public/products/${product.productImage}`}
                              alt={product.productName}
                            />
                            <div>
                              <h4>{product.productName}</h4>
                              <p>Rs. {product.productPrice}</p>
                              <p>{product.productCondition}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === "recommended" && (
                    <div className="recommendations">
                      <h3>Recommended</h3>
                      <div className="recommendation-item">
                        <img src="/assets/logo.png" alt="Gaming Chair" />
                        <div>
                          <h4>Gaming Chair</h4>
                          <p>Rs. 15,000</p>
                          <p>Like New</p>
                        </div>
                      </div>
                      <div className="recommendation-item">
                        <img src="/assets/logo.png" alt="Smartphone" />
                        <div>
                          <h4>Smartphone</h4>
                          <p>Rs. 35,000</p>
                          <p>Brand New</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default HomePage;
