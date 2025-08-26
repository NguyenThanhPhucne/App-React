import React from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/store/ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/store/product/${product._id}`);
  };

  return (
    <div className="product-card" onClick={handleClick}>
      <div className="product-image">
        <img
          src={product.images[0]}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/defaultProduct.jpg";
          }}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category.name}</p>
        <p className="product-price">${product.price.toFixed(2)}</p>
        <p className="product-stock">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
