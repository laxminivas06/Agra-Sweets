import React from 'react';
import { Instagram, Facebook, Twitter, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{ background: '#1E1E1E', color: '#fff', paddingTop: '60px' }}>
      <div className="container" style={{ paddingBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
          
          <div>
            <div className="logo-wrap" style={{ textAlign: 'left', marginBottom: '20px' }}>
              <div className="logo-dots" style={{ color: 'var(--gold)', letterSpacing: '4px' }}>· · · · · · · ·</div>
              <div className="logo-box" style={{ background: 'var(--gold)', display: 'inline-block' }}>AGRA · SWEETS</div>
              <div className="logo-sub" style={{ color: 'var(--gold)', letterSpacing: '4px' }}>· · · · · · · ·</div>
            </div>
            <p className="montserrat" style={{ lineHeight: '1.6', fontSize: '14px', color: '#AAA' }}>
              Delivering premium quality traditional sweets made with pure ingredients, love, and decades of expertise.
            </p>
          </div>

          <div>
            <h4 className="playfair" style={{ marginBottom: '20px', color: 'var(--gold)', fontSize: '20px', letterSpacing: '1px' }}>Contact Us</h4>
            <div className="montserrat" style={{ display: 'flex', flexDirection: 'column', gap: '15px', color: '#CCC', fontSize: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} color="var(--gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>123 Sweet Street, City Center,<br />Agra, UP 282001</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="var(--gold)" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="playfair" style={{ marginBottom: '20px', color: 'var(--gold)', fontSize: '20px', letterSpacing: '1px' }}>Follow Us</h4>
            <div style={{ display: 'flex', gap: '15px' }}>
              <a href="#" style={{ color: '#FFF', transition: 'all 0.2s', padding: '10px', backgroundColor: '#333', borderRadius: '50%', display: 'inline-flex' }}>
                <Instagram size={20} />
              </a>
              <a href="#" style={{ color: '#FFF', transition: 'all 0.2s', padding: '10px', backgroundColor: '#333', borderRadius: '50%', display: 'inline-flex' }}>
                <Facebook size={20} />
              </a>
              <a href="#" style={{ color: '#FFF', transition: 'all 0.2s', padding: '10px', backgroundColor: '#333', borderRadius: '50%', display: 'inline-flex' }}>
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
        </div>
      </div>
      
      <div style={{ background: '#111', padding: '20px 0', textAlign: 'center', color: '#666', fontSize: '13px' }} className="montserrat">
        &copy; {new Date().getFullYear()} Agra Sweets. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
