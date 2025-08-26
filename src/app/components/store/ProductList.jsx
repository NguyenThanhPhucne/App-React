import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import api from "../../services/api";
import ProductCard from "./ProductCard";
import "../../../styles/store/ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [page, category, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/store/products`, {
        params: {
          page,
          category,
          search,
          limit: 12,
        },
      });

      if (response && response.data) {
        setProducts(response.data.products || []);
        setTotalPages(response.data.totalPages || 1);
      } else {
        setProducts([]);
        setTotalPages(1);
        console.error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      // Set default states on error
      setProducts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="store-container">
      <div className="store-filters">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <select value={category} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {/* Categories will be populated from API */}
        </select>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="no-products">No products found.</div>
      )}

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
        >
          Previous
        </button>
        <span>
          {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductList;
