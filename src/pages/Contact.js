import React, { useState } from 'react';
import './Contact.css';

const TELEGRAM_BOT_TOKEN = '7872409790:AAH1yejeWHfy7XLXFKegPJ90cm7c9i_fKws';
const CHAT_ID = '@chemia_chemia';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    telegram: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const text = `
📩 Нове повідомлення з сайту

👤 Ім'я: ${formData.name}
📱 Telegram: ${formData.telegram}
📞 Телефон: ${formData.phone || 'Не вказано'}
📧 Email: ${formData.email || 'Не вказано'}

📝 Тема: ${formData.subject}

💬 Повідомлення:
${formData.message}
`;

    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
        }),
      });

      setSubmitted(true);
    } catch (error) {
      alert('Помилка відправки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      {submitted ? (
        <div className="success-message">
          <h2>Дякуємо!</h2>
          <p>Повідомлення успішно відправлено.</p>
        </div>
      ) : (
        <form className="contact-form" onSubmit={handleSubmit}>
          <h1>Зв'язок з нами</h1>

          <div className="form-group">
            <label>Ваше ім'я *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Telegram *</label>
            <input
              type="text"
              name="telegram"
              value={formData.telegram}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email (необов’язково)</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Телефон (необов’язково)</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Тема *</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Повідомлення *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Відправка...' : 'Відправити'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Contact;
