import React from 'react';
import error from '../assets/images/error.jpg'

export default function Error() {
  // Replace with your own error image URL

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f8f8',
      }}
    >
      <img
        src={error}
        alt="Error"
        style={{ maxWidth: '100%', maxHeight: '80%', borderRadius: '8px' }}
      />
    </div>
  );
};
