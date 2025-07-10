import { useState, useMemo } from 'react';



export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif', background: '#f9f9f9' }}>
      <h1>Confidential Website</h1>
      <p style={{ maxWidth: 400, textAlign: 'center' }}>
        This is a confidential website. Access to timeline data is restricted. Please use your unique tokenized link to view your timeline.
      </p>
    </div>
  );
}
  