import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Showcase from './pages/Showcase';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import ChatWidget from './components/ChatWidget';

// Импортируем prod.json вместо products.json
import productsData from '../src/pages/prod.json';

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.name === item.name);
      if (existing) {
        return prevCart.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (item) => {
    setCart((prevCart) =>
      prevCart
        .map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  return (
    <Router>
      <Navbar cartItemCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
      <ChatWidget />

      <Routes>
        <Route path="/" element={<Showcase addToCart={addToCart} products={productsData} />} />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              addToCart={addToCart}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
            />
          }
        />
        <Route
          path="/checkout"
          element={<Checkout cart={cart} clearCart={clearCart} />}
        />
        <Route path="/contact" element={<Contact />} />

        {/* Динамические страницы продуктов */}
        {productsData.map((product) => (
          <Route
            key={product.image_id}
            path={`/product/${product.image_id}`}
          />
        ))}
      </Routes>
    </Router>
  );
}

export default App;
