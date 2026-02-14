// src/pages/ProductPage.jsx
import React from 'react';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import productsData from './prod.json';

const locales = [
  { lang: 'ru', url: 'https://example.com/ru/products' },
  { lang: 'uk', url: 'https://example.com/ua/products' },
];

// Функция для парсинга цены или диапазона
function parsePrice(priceStr) {
  if (!priceStr) return { lowPrice: '0', highPrice: '0' };
  const numbers = priceStr.replace(/\s/g, '').match(/[\d.,]+/g);
  if (!numbers) return { lowPrice: '0', highPrice: '0' };
  if (numbers.length === 1) return { lowPrice: numbers[0].replace(',', ''), highPrice: numbers[0].replace(',', '') };
  return {
    lowPrice: numbers[0].replace(',', ''),
    highPrice: numbers[1].replace(',', ''),
  };
}

function ProductPage() {
  return (
    <HelmetProvider>
      <div style={{ padding: '20px' }}>
        <Helmet>
          <title>Аптека онлайн – купить сильнодействующие препараты без рецепта</title>
          <meta
            name="description"
            content="Продажа сильнодействующих препаратов без рецепта: АБИЛИФАЙ, Аддерал, Лирика, Модафинил, Морфин и др. Доставка по Украине."
          />
          <meta
            name="keywords"
            content="лекарства, капсулы, таблетки, сильнодействующие, купить онлайн, доставка, без рецепта"
          />
          <link rel="canonical" href="https://example.com/products" />

          {/* hreflang */}
          {locales.map((loc) => (
            <link key={loc.lang} rel="alternate" href={loc.url} hreflang={loc.lang} />
          ))}

          {/* OG */}
          <meta property="og:title" content="Аптека онлайн – купить сильнодействующие препараты" />
          <meta
            property="og:description"
            content="Продажа сильнодействующих препаратов без рецепта с доставкой по Украине."
          />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://example.com/products" />
          <meta property="og:image" content={productsData[0]?.image} />
        </Helmet>

        <h1>Наши сильнодействующие препараты (без рецепта)</h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {productsData.map((item) => (
            <div
              key={item.image_id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '15px',
                width: '240px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              }}
            >
              <img
                src={item.image}
                alt={`${item.name_ru} / ${item.name_ua}`}
                style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
              />

              <h3 style={{ fontSize: '16px', margin: '10px 0 5px' }}>
                {item.name_ru} / {item.name_ua}
              </h3>

              <p style={{ fontSize: '14px', color: '#555' }}>Цена: {item.price}</p>

              {item.no_prescription && (
                <p style={{ color: 'green', fontWeight: 'bold' }}>Без рецепта</p>
              )}

              <button style={{ marginTop: '10px', padding: '5px 10px', cursor: 'pointer' }}>
                В корзину
              </button>
            </div>
          ))}
        </div>

        {/* JSON-LD с автоматическим парсингом диапазонов цен */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Сильнодействующие препараты без рецепта",
            "itemListElement": productsData.map((item, index) => {
              const { lowPrice, highPrice } = parsePrice(item.price);
              return {
                "@type": "Product",
                "position": index + 1,
                "name": item.name_ru,
                "alternateName": item.name_ua,
                "image": item.image,
                "offers": {
                  "@type": "AggregateOffer",
                  "lowPrice": lowPrice,
                  "highPrice": highPrice,
                  "priceCurrency": "UAH",
                  "availability": "https://schema.org/InStock",
                  "offerCount": 1,
                },
              };
            }),
          })}
        </script>
      </div>
    </HelmetProvider>
  );
}

export default ProductPage;
