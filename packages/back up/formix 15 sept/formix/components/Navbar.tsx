'use client';

export default function Navbar() {
  return (
    <nav style={{
      padding: '1.5rem 4rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: '#a8a8a8',
      minHeight: 'auto',
      gap: '2rem',
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img 
          src="/formix-logo.png" 
          alt="Formix Logo" 
          style={{ width: '120px', height: 'auto', objectFit: 'contain', maxWidth: '100%' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <a href="#how" style={{
          color: '#6a3a1a',
          textDecoration: 'none',
          margin: '0 0.5rem',
          fontSize: '0.95rem',
          fontWeight: '700',
          letterSpacing: '0.5px',
          padding: '0.8rem 1.2rem',
          borderRadius: '4px 4px 0 0',
          borderBottom: '3px solid transparent',
          transition: 'all 0.3s',
          background: 'transparent',
        }}>
          How it Works
        </a>
        <a href="#pricing" style={{
          color: '#6a3a1a',
          textDecoration: 'none',
          margin: '0 0.5rem',
          fontSize: '0.95rem',
          fontWeight: '700',
          letterSpacing: '0.5px',
          padding: '0.8rem 1.2rem',
          borderRadius: '4px 4px 0 0',
          borderBottom: '3px solid transparent',
          transition: 'all 0.3s',
          background: 'transparent',
        }}>
          Pricing
        </a>

        {/* NUEVO: Botón Volver a Ximplex */}
        <a href="http://localhost:3001" style={{
          padding: '0.6rem 1.5rem',
          fontSize: '0.85rem',
          textDecoration: 'none',
          display: 'inline-block',
          fontWeight: '700',
          letterSpacing: '0.3px',
          color: '#c9845c',
          background: 'white',
          border: '2px solid #c9845c',
          borderRadius: '4px',
          marginLeft: '1rem',
          transition: 'all 0.3s',
          cursor: 'pointer',
        }}>
          ← Ximplex
        </a>

        <a href="/signin" style={{
          padding: '0.6rem 1.5rem',
          fontSize: '0.85rem',
          cursor: 'pointer',
          textDecoration: 'none',
          display: 'inline-block',
          fontWeight: '700',
          letterSpacing: '0.3px',
          color: 'white',
          background: 'linear-gradient(135deg, #c9845c 0%, #d9945c 100%)',
          border: 'none',
          borderRadius: '4px',
          boxShadow: '0 2px 6px rgba(201, 132, 92, 0.3)',
          marginLeft: '0.5rem',
          transition: 'all 0.3s',
        }}>
          Sign In
        </a>
        <a href="/signup" style={{
          padding: '0.6rem 1.5rem',
          fontSize: '0.85rem',
          cursor: 'pointer',
          textDecoration: 'none',
          display: 'inline-block',
          fontWeight: '700',
          letterSpacing: '0.3px',
          color: 'white',
          background: 'linear-gradient(135deg, #c9845c 0%, #d9945c 100%)',
          border: 'none',
          borderRadius: '4px',
          boxShadow: '0 2px 6px rgba(201, 132, 92, 0.3)',
          marginLeft: '0.5rem',
          transition: 'all 0.3s',
        }}>
          Sign Up
        </a>
      </div>
    </nav>
  );
}