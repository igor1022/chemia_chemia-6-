import React, { useState } from 'react';
import './Showcase.css';
import productsData from './prod.json';

// Парсер цін
const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  const clean = priceStr.replace(/[^\d,.-]/g, '').replace(',', '.');
  return parseFloat(clean) || 0;
};

const Showcase = ({ addToCart }) => {
  const [addedItems, setAddedItems] = useState({});
  const [sortOrder, setSortOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedItems(prev => ({ ...prev, [product.name]: true }));
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.name]: false }));
    }, 1000);
  };

  // Фільтрація та сортування
  const filteredAndSortedProducts = () => {
    let filtered = productsData
      .filter(product => {
        const price = parsePrice(product.price);
        return product.price && price > 0;
      })
      .filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    if (sortOrder === 'asc') {
      filtered.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    }

    if (sortOrder === 'desc') {
      filtered.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }

    return filtered;
  };

  const paginatedProducts = () => {
    const allProducts = filteredAndSortedProducts();
    const start = (currentPage - 1) * itemsPerPage;
    return allProducts.slice(start, start + itemsPerPage);
  };

  const totalPages = Math.ceil(filteredAndSortedProducts().length / itemsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 3) {
      end = Math.min(totalPages, maxVisible);
    } else if (currentPage >= totalPages - 2) {
      start = Math.max(1, totalPages - (maxVisible - 1));
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="showcase">
      <h1>Інтернет Аптека 911</h1>

      <input
        type="text"
        placeholder="Пошук..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="search-input"
      />

      <div className="sort-buttons">
        <button
          className={`sort-button ${sortOrder === null ? 'active' : ''}`}
          onClick={() => setSortOrder(null)}
        >
          За замовчуванням
        </button>
        <button
          className={`sort-button ${sortOrder === 'asc' ? 'active' : ''}`}
          onClick={() => setSortOrder('asc')}
        >
          Ціна ↑
        </button>
        <button
          className={`sort-button ${sortOrder === 'desc' ? 'active' : ''}`}
          onClick={() => setSortOrder('desc')}
        >
          Ціна ↓
        </button>
      </div>

      <div className="products">
        {paginatedProducts().map(product => (
          <div key={product.name} className="product">
            <img
              src={product.localImage || product.image}
              alt={product.name}
              className="product-image"
            />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>{product.price}</p>
              <button
                onClick={() => handleAddToCart(product)}
                className={addedItems[product.name] ? 'added' : ''}
              >
                {addedItems[product.name] ? '✔ Додано' : 'Додати'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
          >
            « Початок
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ‹
          </button>

          {getPageNumbers().map(page => (
            <button
              key={page}
              className={page === currentPage ? 'active' : ''}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            Кінець »
          </button>
        </div>
      )}
    </div>
  );
};

export default Showcase;
