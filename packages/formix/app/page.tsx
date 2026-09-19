'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    background-color: #a8a8a8;
    color: #2a2a2a;
    line-height: 1.6;
  }

  /* Hero Section */
  .hero {
    padding: 3rem 4rem;
    text-align: center;
    background-color: #a8a8a8;
    max-width: 900px;
    margin: 0 auto;
  }

  .hero h1 {
    font-size: 3.5rem;
    font-weight: 700;
    color: #1a1a1a;
    margin-bottom: 1.5rem;
    line-height: 1.2;
  }

  .hero p {
    font-size: 1.2rem;
    color: #3a3a3a;
    margin-bottom: 3rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .cta-button {
    background-color: #c9845c;
    color: white;
    padding: 1rem 2.5rem;
    border: none;
    border-radius: 6px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s;
    text-decoration: none;
    display: inline-block;
  }

  .cta-button:hover {
    background-color: #b87346;
  }

  /* How It Works */
  .section {
    padding: 6rem 4rem;
    background-color: #2d2d2d;
    margin-top: 2rem;
  }

  .section h2 {
    font-size: 2.5rem;
    color: #ffffff;
    text-align: center;
    margin-bottom: 4rem;
    font-weight: 700;
  }

  .steps {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    max-width: 1000px;
    margin: 0 auto;
  }

  .step {
    text-align: center;
    padding: 2rem;
  }

  .step-number {
    background-color: #9b9d8c;
    color: white;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    margin: 0 auto 1.5rem;
    font-size: 1.5rem;
  }

  .step h3 {
    color: #ffffff;
    margin-bottom: 1rem;
    font-size: 1.3rem;
    font-weight: 600;
  }

  .step p {
    color: #e0e0e0;
    font-size: 0.95rem;
  }

  /* Use Cases */
  .use-cases {
    background-color: #2d2d2d;
  }

  .use-cases h2 {
    color: #ffffff;
  }

  .cases-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
    max-width: 1000px;
    margin: 0 auto;
  }

  .case {
    background-color: #3a3a3a;
    padding: 2.5rem;
    border-left: 4px solid #c9845c;
    border-radius: 4px;
  }

  .case h3 {
    color: #ffffff;
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
    font-weight: 600;
  }

  .case p {
    color: #e0e0e0;
    font-size: 0.95rem;
  }

  /* Pricing */
  .pricing {
    max-width: 800px;
    margin: 0 auto;
  }

  .pricing h2 {
    color: #ffffff;
  }

  .pricing-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  .price-card {
    background-color: #3a3a3a;
    padding: 2.5rem;
    border-radius: 8px;
    border: 1px solid #555555;
    text-align: center;
  }

  .price-card h3 {
    color: #ffffff;
    margin-bottom: 1rem;
    font-size: 1.5rem;
    font-weight: 600;
  }

  .price {
    font-size: 2.5rem;
    color: #c9845c;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }

  .price-card ul {
    text-align: left;
    color: #e0e0e0;
    margin-bottom: 2rem;
    list-style: none;
  }

  .price-card li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #f0ede8;
  }

  .price-card li:before {
    content: "✓ ";
    color: #c9845c;
    font-weight: bold;
    margin-right: 0.5rem;
  }

  .price-btn {
    width: 100%;
    padding: 1rem;
    margin-top: 2rem;
    background: linear-gradient(135deg, #c9845c 0%, #d9945c 100%);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
    box-shadow: 0 2px 8px rgba(201, 132, 92, 0.3);
  }

  .price-btn:hover {
    background: linear-gradient(135deg, #d9945c 0%, #e9a46c 100%);
    box-shadow: 0 4px 12px rgba(201, 132, 92, 0.5);
    transform: translateY(-2px);
  }

  .price-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* Footer CTA */
  .footer-cta {
    background-color: #2d2d2d;
    padding: 4rem;
    text-align: center;
  }

  .footer-cta h2 {
    font-size: 2rem;
    color: #ffffff;
    margin-bottom: 1rem;
    font-weight: 700;
  }

  .footer-cta p {
    color: #e0e0e0;
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }

  /* Footer */
  footer {
    background-color: #a8a8a8;
    padding: 3rem 4rem;
    text-align: center;
    color: #5a5a5a;
    font-size: 0.85rem;
  }

  footer a {
    color: #000000;
    text-decoration: none;
    margin: 0 1rem;
  }

  @media (max-width: 768px) {
    .hero h1 {
      font-size: 2.5rem;
    }

    .steps {
      grid-template-columns: 1fr;
    }

    .cases-grid {
      grid-template-columns: 1fr;
    }

    .pricing-cards {
      grid-template-columns: 1fr;
    }
  }

  /* Secret Modal Styles */
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

  /* Launch Banner */
  .launch-banner {
    background-color: #d32f2f;
    padding: 1.5rem;
    text-align: center;
    color: white;
    font-weight: 700;
    font-size: 1.3rem;
    margin: 0;
  }

  .launch-banner span {
    color: white;
    font-weight: 700;
  }
`;

export default function LandingPage() {
  const [showModal, setShowModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
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
        document.cookie = `formix_secret=${token}; path=/; max-age=86400`;
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

  const handleCheckout = async (priceId: string) => {
    const userEmail = prompt('Please enter your email:');

    if (!userEmail) {
      return;
    }

    setIsLoadingCheckout(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userEmail }),
      });

      if (!response.ok) {
        alert('Error creating checkout session. Please try again.');
        setIsLoadingCheckout(false);
        return;
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Error during checkout. Please try again.');
      setIsLoadingCheckout(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      {/* Navigation */}
      <Navbar />

      {/* Launch Banner */}
      <div className="launch-banner">
        🚀 Full App Launching: <span>October 15</span>
      </div>

      {/* Hero */}
      <section className="hero">
        <h1>Turn Web Forms Into WhatsApp Messages</h1>
        <p>Instantly capture client inquiries. Respond faster. Close more deals.</p>
        <button className="cta-button">Get Free 50 Messages</button>
      </section>

      {/* How It Works */}
      <section className="section" id="how">
        <h2>How it works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Create Account</h3>
            <p>Sign up and set up your Formix workspace in seconds.</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Create Form</h3>
            <p>Design your form in minutes. No coding required.</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Share or Embed</h3>
            <p>Get a shareable link or embed on your site. Your choice.</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Receive Client Requests</h3>
            <p>Get all submissions instantly on WhatsApp. Respond faster.</p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section use-cases">
        <h2>For everyone</h2>
        <div className="cases-grid">
          <div className="case">
            <h3>E-commerce</h3>
            <p>Get customer inquiries instantly. Respond on WhatsApp to close sales faster.</p>
          </div>
          <div className="case">
            <h3>Agencies</h3>
            <p>Manage client inquiries and project requests in one place.</p>
          </div>
          <div className="case">
            <h3>Consultants</h3>
            <p>Book appointments and follow up with leads directly on WhatsApp.</p>
          </div>
          <div className="case">
            <h3>Service Businesses</h3>
            <p>Get booking requests and payments in one app.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section pricing" id="pricing">
        <h2>Simple pricing</h2>
        <div className="pricing-cards">
          <div className="price-card">
            <h3>Monthly</h3>
            <div className="price">$12<span style={{ fontSize: '0.5em' }}>/mo</span></div>
            <div style={{ color: '#c9845c', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: '600' }}>
              Perfect for getting started
            </div>
            <ul>
              <li>5 forms</li>
              <li>Unlimited responses</li>
              <li>WhatsApp integration</li>
              <li>Chat + Email support</li>
            </ul>
            <button
              className="price-btn"
              onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID!)}
              disabled={isLoadingCheckout}
            >
              {isLoadingCheckout ? 'Processing...' : 'Subscribe Now'}
            </button>
          </div>
          <div className="price-card">
            <h3>Annual</h3>
            <div className="price">$120<span style={{ fontSize: '0.5em' }}>/year</span></div>
            <div style={{ color: '#c9845c', fontSize: '0.9rem', marginBottom: '1.5rem', fontWeight: '600' }}>
              Save $24 vs monthly
            </div>
            <ul>
              <li>Unlimited forms</li>
              <li>Unlimited responses</li>
              <li>WhatsApp integration</li>
              <li>Chat + Email support</li>
              <li>Advanced customization</li>
            </ul>
            <button
              className="price-btn"
              onClick={() => handleCheckout(process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID!)}
              disabled={isLoadingCheckout}
            >
              {isLoadingCheckout ? 'Processing...' : 'Subscribe Now'}
            </button>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="footer-cta" id="start">
        <h2>Ready to capture more leads?</h2>
        <p style={{ fontSize: '1.1rem' }}>Let Formix help you turn forms into conversations.</p>
        <button className="cta-button" style={{ marginTop: '1rem' }}>Get Free 50 Messages</button>
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
      <footer>
        <p className="copyright-text" onClick={handleCopyrightClick}>
          &copy; 2024 Formix. All rights reserved.
        </p>
        <div>
          <a href="/terms">Terms of Service</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="/refund">Refund Policy</a>
        </div>
      </footer>
    </>
  );
}