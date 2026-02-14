import React, { useState } from 'react';
import './Checkout.css';

// ✅ єдиний надійний парсер ціни
const parsePrice = (priceStr) => {
  if (!priceStr) return 0;

  const clean = priceStr
    .replace(/[^\d,.-]/g, '')
    .replace(',', '.');

  return parseFloat(clean) || 0;
};

const Checkout = ({ cart, clearCart }) => {

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    novaPoshtaBranch: '',
    phone: '',
    email: '',
    telegram: '',
  });

  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);
  const [orderDate, setOrderDate] = useState(null);

  const [confirmedItems, setConfirmedItems] = useState([]);
  const [confirmedTotal, setConfirmedTotal] = useState(0);

  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ поточна сума кошика
  const total = cart.reduce(
    (sum, item) => sum + parsePrice(item.price) * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Кошик порожній');
      return;
    }

    if (sending) return;
    setSending(true);

    const randomOrderNumber =
      Math.floor(Math.random() * 90000) + 10000;

    const today = new Date();
    const formattedDate = today.toLocaleDateString('uk-UA');

    const itemsSnapshot = [...cart];
    const totalSnapshot = total;

    const message = `
<b>Новий замовлення</b>
<b>Номер:</b> ${randomOrderNumber}
<b>Дата:</b> ${formattedDate}
<b>Разом:</b> ${totalSnapshot.toFixed(2)} ₴

<b>Товари:</b>
${itemsSnapshot.map(item =>
  `• ${item.name} — ${item.quantity} × ${parsePrice(item.price).toFixed(2)} ₴`
).join('\n')}

<b>Клієнт:</b>
Ім'я: ${formData.name}
Телефон: ${formData.phone}
Email: ${formData.email}
${formData.telegram ? `Telegram: ${formData.telegram}` : ''}

<b>Доставка:</b>
Місто: ${formData.city}
Відділення НП: ${formData.novaPoshtaBranch}
`;

    const TELEGRAM_BOT_TOKEN = '7872409790:AAH1yejeWHfy7XLXFKegPJ90cm7c9i_fKws';
    const CHAT_ID = '@chemia_chemia';

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'HTML',
          }),
        }
      );

      if (!response.ok) throw new Error('Помилка Telegram');

      setConfirmedItems(itemsSnapshot);
      setConfirmedTotal(totalSnapshot);

      clearCart();

      setOrderNumber(randomOrderNumber);
      setOrderDate(formattedDate);
      setOrderConfirmed(true);

    } catch (err) {
      console.error(err);
      alert('Помилка відправки замовлення');
    }

    setSending(false);
  };

  // =========================
  // ✅ СТОРІНКА ПІДТВЕРДЖЕННЯ
  // =========================

  if (orderConfirmed) {
    return (
      <div className="checkout-container">
        <h1>Замовлення прийнято ✅</h1>

        <p><strong>Номер:</strong> {orderNumber}</p>
        <p><strong>Дата:</strong> {orderDate}</p>
        <p><strong>Разом:</strong> {confirmedTotal.toFixed(2)} ₴</p>

        <h2>Інформація про замовлення</h2>

        <ul className="order-list">
          {confirmedItems.map((item, idx) => (
            <li key={idx}>
              {item.name} — {item.quantity} × {parsePrice(item.price).toFixed(2)} ₴
            </li>
          ))}
        </ul>

        <h2>Дані клієнта</h2>
        <p>{formData.name}</p>
        <p>{formData.phone}</p>
        <p>{formData.email}</p>
        {formData.telegram && <p>{formData.telegram}</p>}
      </div>
    );
  }

  // =========================
  // ✅ ФОРМА
  // =========================

  return (
    <div className="checkout-container">
      <h1>Оформлення замовлення</h1>

      <form className="checkout-form" onSubmit={handleSubmit}>

  <div className="form-section">
    <h2>Дані клієнта</h2>
    <input name="name" placeholder="Ім'я" value={formData.name} onChange={handleChange} required />
    <input name="phone" placeholder="Телефон" value={formData.phone} onChange={handleChange} />
    <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
    <input name="telegram" placeholder="Telegram" value={formData.telegram} onChange={handleChange} required />
  </div>

  <div className="form-section">
    <h2>Доставка</h2>
    <input name="city" placeholder="Місто" value={formData.city} onChange={handleChange} required />
    <input name="novaPoshtaBranch" placeholder="Відділення НП" value={formData.novaPoshtaBranch} onChange={handleChange} required />
  </div>

  <div className="form-section">
    <h2>Ваше замовлення</h2>
    <ul className="order-list">
      {cart.map((item, idx) => (
        <li key={idx}>
          {item.name} — {item.quantity} × {parsePrice(item.price).toFixed(2)} ₴
        </li>
      ))}
    </ul>
    <p className="order-total">Разом: {total.toFixed(2)} ₴</p>
  </div>

  <button type="submit" className="confirm-btn" disabled={sending}>
    {sending ? 'Відправка…' : 'Підтвердити замовлення'}
  </button>

</form>
    </div>
  );
};

export default Checkout;
