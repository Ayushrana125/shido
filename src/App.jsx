import React from 'react';

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F6F7F9', padding: '20px' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto', backgroundColor: 'white', padding: '20px', borderRadius: '10px' }}>
        <h1 style={{ color: '#7ED1C1', fontSize: '32px', textAlign: 'center', marginBottom: '20px' }}>
          Shido
        </h1>
        <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '30px' }}>
          Way to Discipline
        </p>
        <div style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ marginBottom: '10px' }}>Environment Check:</p>
          <p>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Missing'}</p>
          <p>Supabase Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}</p>
        </div>
      </div>
    </div>
  );
}

export default App;