import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAdminLogin } from '../services/dataService';
import { Lock, User, Key, Eye, EyeOff, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const isValid = await checkAdminLogin(username, password);
    if (isValid) {
      sessionStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError('Invalid username or password');
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--cream)',
      backgroundImage: 'radial-gradient(circle, rgba(139,26,26,0.08) 1px, transparent 1px)',
      backgroundSize: '28px 28px',
      padding: '20px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '450px',
        background: '#fff',
        borderRadius: '24px',
        padding: 'clamp(24px, 6vw, 48px)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1), 0 4px 12px rgba(0,0,0,0.05)',
        animation: 'fadeInUp 0.5s ease-out'
      }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(24px, 6vw, 32px)' }}>
          <div style={{
            display: 'inline-flex',
            padding: '16px',
            background: 'rgba(139,26,26,0.1)',
            borderRadius: '50%',
            marginBottom: '20px',
            animation: 'pulse 2s infinite'
          }}>
            <Lock size={40} color="var(--crimson)" />
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 5vw, 32px)',
            fontWeight: '800',
            color: '#2D2D2D',
            marginBottom: '8px',
            fontFamily: "'Playfair Display', serif"
          }}>Admin Portal</h2>
          <p style={{ color: '#7A7A7A', fontSize: '15px' }}>Login to manage your store</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            padding: '12px 16px',
            background: '#FEE2E2',
            color: '#DC2626',
            borderRadius: '12px',
            marginBottom: '20px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderLeft: '4px solid #DC2626'
          }}>
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          {/* Username Field */}
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#4A4A4A',
              fontSize: '14px'
            }}>
              Username
            </label>
            <div style={{ position: 'relative' }}>
              <User size={20} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--crimson)',
                opacity: 0.8
              }} />
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 45px',
                  border: '2px solid #E5E5E5',
                  borderRadius: '12px',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--crimson)'}
                onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
                placeholder="Enter your username"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              color: '#4A4A4A',
              fontSize: '14px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Key size={20} style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--crimson)',
                opacity: 0.8
              }} />
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 14px 14px 45px',
                  border: '2px solid #E5E5E5',
                  borderRadius: '12px',
                  fontSize: '15px',
                  transition: 'all 0.3s ease',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--crimson)'}
                onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#7A7A7A',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '14px 24px',
              background: 'var(--crimson)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s ease',
              opacity: isLoading ? 0.7 : 1,
              fontFamily: "'Montserrat', sans-serif"
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.background = 'var(--dark-red)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.background = 'var(--crimson)';
              }
            }}
          >
            {isLoading ? (
              'Logging in...'
            ) : (
              <>
                Login to Dashboard <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer Note */}
        <div style={{
          marginTop: '24px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#7A7A7A',
          borderTop: '1px solid #F0E0D0',
          paddingTop: '20px'
        }}>
          Secure admin access only
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        @media (max-width: 480px) {
          .form-control {
            font-size: 14px !important;
          }
        }
        
        input:focus {
          border-color: var(--crimson) !important;
          box-shadow: 0 0 0 3px rgba(139,26,26,0.1);
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;