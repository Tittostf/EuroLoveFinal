import React from "react";
import "./App.css";

function App() {
  console.log("App component is rendering!");
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #ec4899, #8b5cf6, #3730a3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        maxWidth: '400px',
        width: '100%',
        padding: '32px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderRadius: '16px',
        border: '1px solid rgba(236, 72, 153, 0.2)',
        textAlign: 'center',
        backdropFilter: 'blur(10px)'
      }}>
        {/* Logo */}
        <div style={{
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: '32px',
          fontWeight: 'bold',
          color: 'white'
        }}>
          EL
        </div>
        
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          color: 'white', 
          margin: '0 0 8px' 
        }}>
          EuroLove
        </h1>
        
        <p style={{ 
          color: '#d1d5db', 
          margin: '0 0 24px',
          fontSize: '18px'
        }}>
          Premium Dating Platform
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button style={{
            width: '100%',
            background: 'linear-gradient(135deg, #dc2626, #7c2d12)',
            color: 'white',
            fontWeight: '500',
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.2s'
          }} 
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          onClick={() => alert('Login clicked!')}>
            Login
          </button>
          
          <button style={{
            width: '100%',
            background: 'linear-gradient(135deg, #4b5563, #374151)',
            color: 'white',
            fontWeight: '500',
            padding: '12px 16px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          onClick={() => alert('Register clicked!')}>
            Register
          </button>
        </div>
        
        <div style={{ marginTop: '24px' }}>
          <p style={{ 
            color: '#9ca3af', 
            fontSize: '14px',
            margin: 0
          }}>
            Platform Status: <span style={{ color: '#10b981' }}>✅ Online</span>
          </p>
          <p style={{ 
            color: '#9ca3af', 
            fontSize: '12px',
            margin: '8px 0 0',
            opacity: 0.7
          }}>
            Backend Connected • Database Ready
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;