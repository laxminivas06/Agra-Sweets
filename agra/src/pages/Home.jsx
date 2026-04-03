import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSweets } from '../services/dataService';
import { ArrowRight, Star } from 'lucide-react';

const Home = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // High-definition images - NO BLUR, crisp and clear
  const heroImages = [
    "https://bhagathalwai.com/cdn/shop/files/2.jpg?v=1728983449&width=2000",
    "https://img.freepik.com/premium-photo/kalakand-is-indian-sweet-is-made-from-solidified-sweetened-milk-paneer-served-bowl-with-dry-fruit-toppingsselective-focus_726363-896.jpg",
    "https://t3.ftcdn.net/jpg/17/03/95/84/360_F_1703958464_VsrmZwc3jrG0FsWgvdtKZZaEVF4IiFXc.jpg"
  ];

  useEffect(() => {
    const loadData = async () => {
      const data = await getSweets();
      setSweets(data);
      setLoading(false);
    };
    loadData();

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Generate the decorative tile pattern
  const tile = (key) => (
    <div className="deco-tile" key={key}>
      <svg viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <rect width="36" height="36" fill="#8B1A1A" />
        <g fill="white" transform="translate(18,18)">
          {Array.from({ length: 8 }, (_, i) => {
            const a = i * Math.PI / 4;
            const x = Math.cos(a) * 8;
            const y = Math.sin(a) * 8;
            return <ellipse key={i} cx={x.toFixed(1)} cy={y.toFixed(1)} rx="3" ry="4.5" transform={`rotate(${i * 45})`} />;
          })}
          <circle r="3" fill="white" />
        </g>
      </svg>
    </div>
  );

  return (
    <div className="landing-page">
      <main>
        {/* HERO SECTION */}
        <div className="hero">
          <div className="hero-pattern"></div>
          <div className="hero-overlay"></div>

          {/* Decorative Petals */}
          <div className="petal"></div>
          <div className="petal"></div>
          <div className="petal"></div>

          {/* Image Carousel - NO BLUR, NO ROTATION, CRISP HD */}
          <div className="hero-plate" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: '50%',
            position: 'relative',
            backgroundColor: '#2a1a1a'
          }}>
            <div className="plate-outer" style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '4px solid #c9a84c',
              zIndex: 2,
              pointerEvents: 'none',
              boxShadow: '0 0 0 8px rgba(201,168,76,0.2)'
            }}></div>
            {heroImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Agra Sweet"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: currentSlide === index ? 1 : 0,
                  transition: 'opacity 1s ease-in-out', // Only opacity transition, no rotation/blur
                  zIndex: 1,
                  filter: 'none',           // REMOVED BLUR
                  transform: 'none',        // REMOVED ROTATION
                  imageRendering: 'crisp-edges', // Sharp rendering
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden'
                }}
              />
            ))}
          </div>

          <div className="side-bowl sb1"></div>
          <div className="side-bowl sb2"></div>

          <div className="hero-content">
            <h1 className="playfair" style={{ fontSize: 'clamp(42px, 6vw, 72px)', fontWeight: '900', color: '#fff', lineHeight: 1.0, textTransform: 'uppercase', letterSpacing: '-0.01em', marginBottom: '16px', textShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
              SWEETS<br />& SAVOURIES
            </h1>
            <p className="cormorant" style={{ fontSize: '20px', fontWeight: '300', color: 'rgba(255,255,255,0.9)', letterSpacing: '0.08em', marginBottom: '36px', maxWidth: '80%', wordWrap: 'break-word' }}>
              At Agra Sweet Centre we offer a wide range <br /> of farsan, tempting sweets and other delicacies.
            </p>
            <a href="#collection" className="btn-enquire">ENQUIRE NOW</a>

            {/* Reviews */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '50px' }}>
              <div style={{ display: 'flex' }}>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F5E6D3', border: '2px solid var(--forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: i === 1 ? '0' : '-12px', zIndex: 5 - i }}>
                    <div style={{ fontSize: '18px' }}>👤</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '16px' }}>Happy Customers</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[1, 2, 3, 4, 5].map(star => <Star key={star} size={16} fill="#C9A84C" stroke="#C9A84C" color="#C9A84C" />)}
                  </div>
                  <span style={{ fontWeight: 'bold', color: '#fff' }}>4.9</span>
                  <span style={{ fontSize: '13px', color: 'var(--cream)' }}>(20K reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative border */}
        <div className="deco-border">
          <div className="deco-pattern">
            {Array.from({ length: 40 }).map((_, i) => tile(i))}
          </div>
        </div>

        <div className="container" style={{ margin: '-40px auto 40px', zIndex: 10 }}>
          <div className="stats-card">
            <div className="stat-item">
              <div className="stat-number">500+</div>
              <div className="montserrat" style={{ color: '#5A5A5A', fontWeight: '500', fontSize: '14px' }}>Visitors Weekly</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10k+</div>
              <div className="montserrat" style={{ color: '#5A5A5A', fontWeight: '500', fontSize: '14px' }}>Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">94%</div>
              <div className="montserrat" style={{ color: '#5A5A5A', fontWeight: '500', fontSize: '14px' }}>Positive Feedback</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">30+</div>
              <div className="montserrat" style={{ color: '#5A5A5A', fontWeight: '500', fontSize: '14px' }}>Years Legacy</div>
            </div>
          </div>
        </div>

        <section id="collection" className="container" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ marginBottom: '50px' }}>
            <h2 className="playfair" style={{ fontSize: 'clamp(32px, 5vw, 44px)', fontWeight: '900', color: 'var(--crimson)', marginBottom: '15px' }}>
              Discover Our Range
            </h2>
            <div className="logo-dots">· · · · · · · · · · · · · ·</div>
            <p className="montserrat" style={{ fontSize: '16px', color: '#5A5A5A', maxWidth: '550px', margin: '20px auto 0' }}>
              Our mouth-watering range of delicacies built with pure quality ingredients sourced globally.
            </p>
          </div>

          {loading ? (
            <div style={{ padding: '80px 0', fontSize: '18px', fontWeight: 'bold', color: 'var(--crimson)' }}>Crafting your collection...</div>
          ) : (
            <div className="sweets-grid">
              {sweets.map((sweet) => (
                <div key={sweet.id} className="product-card">
                  <div style={{ padding: '20px', textAlign: 'center', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {sweet.image ? (
                      <img src={sweet.image} alt={sweet.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    ) : (
                      <div style={{ fontSize: '5rem' }}>🍬</div>
                    )}
                  </div>
                  <div style={{ padding: '20px 0 10px', borderTop: '1px dashed var(--gold)' }}>
                    <h3 className="playfair" style={{ fontSize: '22px', fontWeight: '800', color: 'var(--crimson)', marginBottom: '10px' }}>{sweet.name}</h3>
                    <p className="montserrat" style={{ fontSize: '13px', color: '#6A6A6A', marginBottom: '20px', lineHeight: '1.6', minHeight: '44px' }}>
                      {sweet.description || "Authentic delicacy made with pure desi ghee and love."}
                    </p>
                    <Link to={`/sweet/${sweet.qr}`} className="btn-enquire" style={{ background: 'var(--crimson)', color: '#fff' }}>
                      EXPLORE MORE
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section id="about" style={{ padding: '80px 20px', background: 'var(--crimson)', color: '#fff', marginTop: '40px' }}>
          <div className="container" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>🍬</div>
            <h2 className="playfair" style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: '900', marginBottom: '20px' }}>
              Gifting the joy of tradition
            </h2>
            <p className="cormorant" style={{ fontSize: '22px', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto 40px' }}>
              Experience the authentic essence of Indian heritage with our exquisite collection of sweets and farsan. Every item is crafted with pure ingredients and centuries-old recipes to ensure you get the true taste of Agra in every bite.
            </p>
            <a href="#collection" className="btn-enquire" style={{ background: 'var(--gold)', color: '#fff' }}>Shop Now</a>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Home;