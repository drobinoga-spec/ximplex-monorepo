'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const styles = `
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: #3a3a3a;
    padding: 2.5rem;
    border-radius: 8px;
    border: 1px solid #555555;
    text-align: center;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  }

  .modal-content h3 {
    color: #ffffff;
    margin-bottom: 1.5rem;
    font-size: 1.3rem;
    font-weight: 600;
  }

  .modal-content input {
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 1rem;
    border: 1px solid #555555;
    border-radius: 4px;
    background-color: #2d2d2d;
    color: #ffffff;
    font-size: 1rem;
    box-sizing: border-box;
  }

  .modal-content input::placeholder {
    color: #999999;
  }

  .modal-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .modal-btn {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    font-weight: 600;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s;
    flex: 1;
  }

  .modal-btn-submit {
    background: linear-gradient(135deg, #c9845c 0%, #d9945c 100%);
    color: white;
  }

  .modal-btn-submit:hover {
    background: linear-gradient(135deg, #d9945c 0%, #e9a46c 100%);
    transform: translateY(-2px);
  }

  .modal-btn-cancel {
    background-color: #555555;
    color: white;
  }

  .modal-btn-cancel:hover {
    background-color: #666666;
  }

  .modal-error {
    color: #ff6b6b;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .copyright-text {
    cursor: pointer;
    transition: all 0.3s;
    color: #3a3a3a !important;
    text-decoration: none;
    border-bottom: 2px solid transparent;
  }

  .copyright-text:hover {
    color: #c9845c;
    border-bottom: 2px solid #c9845c;
    text-decoration: underline;
  }

  .app-card {
    transition: all 0.3s ease;
  }

  .app-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  }

  .app-card-coming {
    transition: all 0.3s ease;
  }

  .app-card-coming:hover {
    transform: none;
    box-shadow: none;
  }
`;

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleCopyrightClick = () => {
    setShowModal(true);
    setPasswordInput('');
    setErrorMessage('');
  };

  const handlePasswordSubmit = async () => {
    try {
      const response = await fetch('/api/auth/verify-secret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput }),
      });

      if (response.ok) {
        const { token } = await response.json();
        document.cookie = `ximplex_secret=${token}; path=/; max-age=86400`;
        setShowModal(false);
        router.push('/my-desk');
      } else {
        setErrorMessage('Contraseña incorrecta');
        setPasswordInput('');
      }
    } catch (error) {
      console.error('Error verificando contraseña:', error);
      setErrorMessage('Error verificando contraseña');
      setPasswordInput('');
    }
  };

  const handleModalCancel = () => {
    setShowModal(false);
    setPasswordInput('');
    setErrorMessage('');
  };

  const handlePasswordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePasswordSubmit();
    }
  };

  // Navegar a apps
  const navigateToApp = (appPath: string) => {
    window.location.href = appPath;
  };

  return (
    <div style={{ backgroundColor: '#a8a8a8', minHeight: '100vh', color: '#000000' }}>
      <style>{styles}</style>

      {/* Navigation */}
      <nav style={{ 
        padding: '1.5rem 4rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        backgroundColor: '#a8a8a8',
        gap: '2rem'
      }}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>✨ Ximplex</div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="#apps" style={{ textDecoration: 'none', color: '#000000', fontWeight: '600' }}>Apps</a>
          <a href="#pricing" style={{ textDecoration: 'none', color: '#000000', fontWeight: '600' }}>Pricing</a>
          <a href="/signin" style={{ 
            padding: '0.6rem 1.5rem', 
            backgroundColor: '#c9845c', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '4px',
            fontWeight: '700'
          }}>Sign In</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        padding: '3rem 4rem', 
        textAlign: 'center', 
        backgroundColor: '#a8a8a8',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: '700', 
          color: '#000000',
          marginBottom: '1.5rem',
          lineHeight: '1.2'
        }}>
          One Login for All Apps
        </h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: '#2a2a2a',
          marginBottom: '3rem',
          maxWidth: '600px',
          margin: '0 auto 3rem'
        }}>
          Small solutions for everyone. Build, integrate, and scale your apps ecosystem.
        </p>
        <button style={{
          backgroundColor: '#c9845c',
          color: 'white',
          padding: '1rem 2.5rem',
          border: 'none',
          borderRadius: '6px',
          fontSize: '1.1rem',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Explore Apps
        </button>
      </section>

      {/* Apps Section */}
      <section id="apps" style={{ 
        padding: '6rem 4rem', 
        backgroundColor: '#2d2d2d',
        marginTop: '2rem'
      }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          color: '#ffffff',
          textAlign: 'center',
          marginBottom: '4rem',
          fontWeight: '700'
        }}>
          Our Apps
        </h2>
        
        {/* First Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '2rem',
          maxWidth: '1000px',
          margin: '0 auto 2rem'
        }}>
          {/* Formix Card - CLICKEABLE */}
          <div
            className="app-card"
            onClick={() => navigateToApp('http://localhost:3000')}
            style={{
              backgroundColor: '#3a3a3a',
              padding: '2.5rem',
              borderLeft: '4px solid #c9845c',
              borderRadius: '4px',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
            <h3 style={{ color: '#ffffff', marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: '600' }}>Formix</h3>
            <p style={{ color: '#e0e0e0', fontSize: '0.95rem' }}>Forms → WhatsApp</p>
          </div>

          {/* My-Desk Card - CLICKEABLE */}
          <div
            className="app-card"
            onClick={() => navigateToApp('http://localhost:3003')}
            style={{
              backgroundColor: '#3a3a3a',
              padding: '2.5rem',
              borderLeft: '4px solid #c9845c',
              borderRadius: '4px',
              textAlign: 'center',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
            <h3 style={{ color: '#ffffff', marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: '600' }}>My-Desk</h3>
            <p style={{ color: '#e0e0e0', fontSize: '0.95rem' }}>Admin Dashboard</p>
          </div>

          {/* Placeholder 1 */}
          <div
            className="app-card-coming"
            style={{
              backgroundColor: '#555555',
              padding: '2.5rem',
              borderRadius: '4px',
              textAlign: 'center',
              opacity: '0.6'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔜</div>
            <h3 style={{ color: '#cccccc', marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: '600' }}>Coming Soon</h3>
            <p style={{ color: '#999999', fontSize: '0.95rem' }}>New solution</p>
          </div>
        </div>

        {/* Second Row */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '2rem',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="app-card-coming" style={{
              backgroundColor: '#555555',
              padding: '2.5rem',
              borderRadius: '4px',
              textAlign: 'center',
              opacity: '0.6'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔜</div>
              <h3 style={{ color: '#cccccc', marginBottom: '0.5rem', fontSize: '1.2rem', fontWeight: '600' }}>Coming Soon</h3>
              <p style={{ color: '#999999', fontSize: '0.95rem' }}>New solution</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ 
        padding: '6rem 4rem', 
        backgroundColor: '#2d2d2d',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          color: '#ffffff',
          textAlign: 'center',
          marginBottom: '4rem',
          fontWeight: '700'
        }}>
          Simple Pricing
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '2rem'
        }}>
          <div style={{
            backgroundColor: '#3a3a3a',
            padding: '2.5rem',
            borderRadius: '8px',
            border: '1px solid #555555',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>Starter</h3>
            <div style={{ fontSize: '2.5rem', color: '#c9845c', fontWeight: '700', marginBottom: '1.5rem' }}>$19<span style={{ fontSize: '0.5em' }}>/mo</span></div>
            <p style={{ color: '#c9845c', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: '600' }}>1 app included</p>
            <ul style={{ textAlign: 'left', color: '#e0e0e0', marginBottom: '2rem', listStyle: 'none', paddingLeft: '0' }}>
              <li style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #f0ede8' }}>✓ 1 App Access</li>
              <li style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #f0ede8' }}>✓ Basic Support</li>
              <li style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #f0ede8' }}>✓ Community</li>
            </ul>
            <button style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #c9845c 0%, #d9945c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}>Get Started</button>
          </div>

          <div style={{
            backgroundColor: '#3a3a3a',
            padding: '2.5rem',
            borderRadius: '8px',
            border: '1px solid #555555',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600' }}>Pro</h3>
            <div style={{ fontSize: '2.5rem', color: '#c9845c', fontWeight: '700', marginBottom: '1.5rem' }}>$99<span style={{ fontSize: '0.5em' }}>/mo</span></div>
            <p style={{ color: '#c9845c', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: '600' }}>Unlimited apps</p>
            <ul style={{ textAlign: 'left', color: '#e0e0e0', marginBottom: '2rem', listStyle: 'none', paddingLeft: '0' }}>
              <li style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #f0ede8' }}>✓ All Apps Unlimited</li>
              <li style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #f0ede8' }}>✓ Priority Support</li>
              <li style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #f0ede8' }}>✓ Advanced Features</li>
            </ul>
            <button style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #c9845c 0%, #d9945c 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer'
            }}>Get Started</button>
          </div>
        </div>
      </section>

      {/* Secret Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleModalCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Acceso Especial</h3>
            {errorMessage && <div className="modal-error">{errorMessage}</div>}
            <input
              type="password"
              placeholder="Ingresa la contraseña"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyPress={handlePasswordKeyPress}
              autoFocus
            />
            <div className="modal-buttons">
              <button className="modal-btn modal-btn-submit" onClick={handlePasswordSubmit}>
                Entrar
              </button>
              <button className="modal-btn modal-btn-cancel" onClick={handleModalCancel}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ 
        backgroundColor: '#a8a8a8', 
        padding: '3rem 4rem', 
        textAlign: 'center', 
        color: '#3a3a3a',
        fontSize: '0.85rem'
      }}>
        <p className="copyright-text" onClick={handleCopyrightClick}>
          © 2026 Ximplex. Built with ❤️
        </p>
      </footer>
    </div>
  );
}