import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../../services/api';
import '../../../styles/store/ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/store/products/${id}`);
            setProduct(response.data);
            if (response.data.variants.length > 0) {
                setSelectedVariant(response.data.variants[0]);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            setError('Failed to load product details');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!selectedVariant) {
            setError('Please select a variant');
            return;
        }

        try {
            await api.post('/store/cart/add', {
                productId: product._id,
                variantId: selectedVariant._id,
                quantity
            });
            
            // Show success message
            alert('Product added to cart successfully');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to add to cart');
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!product) {
        return <div className="error">Product not found</div>;
    }

    return (
        <div className="product-detail-container">
            <div className="product-images">
                {product.images.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`${product.name} - ${index + 1}`}
                        className="product-image"
                    />
                ))}
            </div>

            <div className="product-info">
                <h1>{product.name}</h1>
                <p className="category">{product.category.name}</p>
                <p className="price">${product.price.toFixed(2)}</p>
                <p className="description">{product.description}</p>

                {product.variants.length > 0 && (
                    <div className="variants">
                        <h3>Available Variants</h3>
                        <div className="variant-grid">
                            {product.variants.map(variant => (
                                <button
                                    key={variant._id}
                                    className={`variant-button ${selectedVariant?._id === variant._id ? 'selected' : ''}`}
                                    onClick={() => setSelectedVariant(variant)}
                                    disabled={variant.inventory === 0}
                                >
                                    {variant.size} - {variant.color}
                                    {variant.inventory === 0 && ' (Out of Stock)'}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="quantity-selector">
                    <label htmlFor="quantity">Quantity:</label>
                    <select
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                    >
                        {[...Array(10)].map((_, i) => (
                            <option key={i + 1} value={i + 1}>
                                {i + 1}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    className="add-to-cart-button"
                    onClick={handleAddToCart}
                    disabled={!selectedVariant || selectedVariant.inventory === 0}
                >
                    Add to Cart
                </button>

                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default ProductDetail;
