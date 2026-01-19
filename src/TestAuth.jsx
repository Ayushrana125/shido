import React from 'react';

const TestAuth = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6F7F9', padding: '20px' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
        <h1 style={{ color: '#7ED1C1', fontSize: '32px', textAlign: 'center', marginBottom: '20px' }}>
          Shido
        </h1>
        <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '30px' }}>
          Way to Discipline
        </p>
        <form>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email</label>
            <input 
              type="email" 
              style={{ width: '100%', padding: '10px', border: '2px solid #E5E7EB', borderRadius: '8px' }}
              placeholder="your@email.com"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Password</label>
            <input 
              type="password" 
              style={{ width: '100%', padding: '10px', border: '2px solid #E5E7EB', borderRadius: '8px' }}
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            style={{ 
              width: '100%', 
              padding: '15px', 
              backgroundColor: '#7ED1C1', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default TestAuth;