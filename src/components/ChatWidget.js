import React, { useState } from 'react';
import widgetImage from '../assets/widget.png';
import './ChatWidget.css';

const TELEGRAM_BOT_TOKEN = '7872409790:AAH1yejeWHfy7XLXFKegPJ90cm7c9i_fKws';
const TELEGRAM_CHAT_ID = '423871593'; // Ваш ID, @username не підходить для API

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1); // 1-привітання, 2-форма, 3-дякуємо
  const [name, setName] = useState('');
  const [telegram, setTelegram] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !telegram.trim()) return;

    setSending(true);

    const message = `Новий клієнт:\nІм'я: ${name}\nTelegram: ${telegram}`;

    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
        }),
      });
      setStep(3); // Показуємо повідомлення "Дякуємо"
    } catch (err) {
      console.error('Помилка відправки в Telegram', err);
      alert('Помилка відправки, спробуйте ще раз.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="chat-widget-wrapper">
      <div className={`chat-popup ${open ? 'open' : ''}`}>
        <div className="chat-header">
          <img src={widgetImage} alt="logo" className="chat-widget-image" />
          <button onClick={() => setOpen(false)}>×</button>
        </div>

        <div className="chat-body">
          {step === 1 && (
            <div className="chat-message manager">
              Вітаємо! Будь ласка, заповніть форму: вкажіть ваше ім'я та Telegram.
            </div>
          )}

          {step === 2 && (
            <form className="chat-form" onSubmit={handleSubmit}>
              <input
                placeholder="Ваше ім'я"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                placeholder="Ваш Telegram"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                required
              />
              <button type="submit" disabled={sending}>
                {sending ? 'Відправка...' : 'Відправити'}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="chat-message manager">
              Дякуємо! Ми зв'яжемося з вами найближчим часом.  
              Для зв'язку з менеджером: 
              <a 
                href="https://t.me/igorgagarin" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                @igorgagarin
              </a>
            </div>
          )}
        </div>

        {step === 1 && (
          <div className="chat-footer">
            <button onClick={() => setStep(2)}>Заповнити форму</button>
          </div>
        )}
      </div>

      <div className="chat-side-button" onClick={() => setOpen(!open)}>
        Онлайн консультант
      </div>
    </div>
  );
}
