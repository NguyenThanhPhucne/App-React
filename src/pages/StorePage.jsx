import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";
import { ArrowLeft } from "lucide-react";
import ProductList from "../app/components/store/ProductList";
import ProductDetail from "../app/components/store/ProductDetail";
import Cart from "../app/components/store/Cart";
import Checkout from "../app/components/store/Checkout";
import StoreUserPanel from "../app/components/store/StoreUserPanel";
import "../styles/store/store.css";

const StorePage = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const user = useSelector((state) => state.user);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
  };

  const handleProceedToCheckout = () => {
    setShowCheckout(true);
  };

  const handleBackToCart = () => {
    setShowCheckout(false);
  };

  const renderContent = () => {
    if (showCheckout) {
      return <Checkout onBack={handleBackToCart} />;
    }

    if (selectedProduct) {
      return (
        <ProductDetail
          product={selectedProduct}
          onBack={handleBackToProducts}
        />
      );
    }

    if (activeTab === "cart") {
      return <Cart onCheckout={handleProceedToCheckout} />;
    }

    return <ProductList onProductClick={handleProductClick} />;
  };

  return (
    <div className="store-page">
      <div className="store-header">
        <div className="store-header-top">
          <div className="store-title">
            <button
              className="action-btn"
              onClick={() => navigate(-1)}
              title="Back to Chat"
            >
              <ArrowLeft size={20} />
            </button>
            <span>Store</span>
          </div>

          {/* Add StoreUserPanel to header */}
          <StoreUserPanel />
        </div>

        <div className="store-nav">
          <button
            className={`store-tab ${activeTab === "products" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("products");
              setSelectedProduct(null);
              setShowCheckout(false);
            }}
          >
            <i className="fas fa-shopping-bag"></i>
            Products
          </button>
          <button
            className={`store-tab ${activeTab === "cart" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("cart");
              setSelectedProduct(null);
              setShowCheckout(false);
            }}
          >
            <i className="fas fa-shopping-cart"></i>
            Cart
          </button>
        </div>
      </div>

      <div className="store-content">
        {/* Search Bar */}
        {activeTab === "products" && !selectedProduct && (
          <div className="store-search">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search for games or items..." />
          </div>
        )}

        {renderContent()}
      </div>
    </div>
  );
};

export default StorePage;
