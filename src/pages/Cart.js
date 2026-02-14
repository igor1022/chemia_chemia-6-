import { Link } from 'react-router-dom';
import './Cart.css';

// ✅ Єдиний правильний парсер ціни
const parsePrice = (priceStr) => {
  if (!priceStr) return 0;

  const clean = priceStr
    .replace(/[^\d,.-]/g, '')  
    .replace(',', '.');        

  return parseFloat(clean) || 0;
};

const Cart = ({ cart, addToCart, removeFromCart, clearCart }) => {

  const subtotal = cart.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <h1 className="cart-title">Кошик</h1>

      {cart.length === 0 ? (
        <p className="cart-empty">Кошик порожній</p>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Товар</th>
                <th className="text-center">Ціна</th>
                <th className="text-center">Кількість</th>
                <th className="text-center">Підсумок</th>
              </tr>
            </thead>

            <tbody>
              {cart.map((item, index) => {
                const price = parsePrice(item.price);
                const rowTotal = price * item.quantity;

                return (
                  <tr key={index}>
                    <td>{item.name}</td>

                    <td className="text-center">
                      {price.toFixed(2)} ₴
                    </td>

                    <td className="text-center">
                      <div className="quantity-controls">
                        <button
                          onClick={() => removeFromCart(item)}
                          className="quantity-btn"
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() => addToCart(item)}
                          className="quantity-btn"
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td className="text-center">
                      {rowTotal.toFixed(2)} ₴
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="totals">
            <p className="total-amount">
              Разом: {subtotal.toFixed(2)} ₴
            </p>
          </div>

          <div className="buttons-row">
            <button onClick={clearCart} className="clear-btn">
              Очистити кошик
            </button>

            <Link to="/checkout" className="checkout-link">
              Оформити замовлення
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
