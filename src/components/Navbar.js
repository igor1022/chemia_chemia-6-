import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">💊 Online Apteka</div>

        <div className={`navbar-links ${isOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setIsOpen(false)}>Вітрина</Link>
          <Link to="/cart" onClick={() => setIsOpen(false)}>Кошик</Link>
          <Link to="/checkout" onClick={() => setIsOpen(false)}>Оформлення замовлення</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)}>Контакти</Link>
        </div>

        <div className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
