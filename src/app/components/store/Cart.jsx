import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import '../../../styles/store/Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await api.get('/store/cart');
            setCart(response.data);
        } catch (error) {
            setError('Failed to load cart');
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            const response = await axios.put('/api/store/cart/item', {
                itemId,
                quantity
            });
            setCart(response.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update quantity');
        }
    };

    const removeItem = async (itemId) => {
        try {
            const response = await axios.delete(`/api/store/cart/item/${itemId}`);
            setCart(response.data);
        } catch (error) {
            setError('Failed to remove item');
        }
    };

    const handleCheckout = () => {
        navigate('/store/checkout');
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="empty-cart">
                <h2>Your cart is empty</h2>
                <button onClick={() => navigate('/store')}>
                    Continue Shopping
                </button>
            </div>
        );
    }

    const calculateTotal = () => {
        return cart.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    };

    return (
        <div className="cart-container">
            <h1>Shopping Cart</h1>
            
            <div className="cart-items">
                {cart.items.map(item => (
                    <div key={item._id} className="cart-item">
                        <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="item-image"
                        />
                        
                        <div className="item-details">
                            <h3>{item.product.name}</h3>
                            <p>Size: {item.variant.size}</p>
                            <p>Color: {item.variant.color}</p>
                            <p className="item-price">
                                ${item.product.price.toFixed(2)}
                            </p>
                        </div>

                        <div className="item-quantity">
                            <select
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                            >
                                {[...Array(10)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="item-total">
                            ${(item.product.price * item.quantity).toFixed(2)}
                        </div>

                        <button
                            className="remove-item"
                            onClick={() => removeItem(item._id)}
                        >
                            Remove
                        </button>
                    </div>
                ))}
            </div>

            <div className="cart-summary">
                <div className="total">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                </div>

                <button
                    className="checkout-button"
                    onClick={handleCheckout}
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default Cart;
