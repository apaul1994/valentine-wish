import React, { useState } from 'react';

export default function Gate({ onUnlock }) {
  // Assumption: Anniversary pin is 0214 (Feb 14). Change if different.
  const PIN = '1924';
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  function onChange(e) {
    const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setInput(v);
    setError('');
    if (v.length === 4) {
      if (v === PIN) onUnlock();
      else setError('Incorrect PIN — try again ❤️');
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="glass max-w-md w-full p-6 rounded-2xl text-center">
        <h1 className="text-3xl font-dancing text-valent-700">For Mitu 💕</h1>
        <p className="mt-2 text-sm text-gray-100">Enter our 4-digit anniversary pin to open your surprise.</p>

        <div className="mt-6">
          <input
            aria-label="pin"
            value={input}
            onChange={onChange}
            className="w-48 text-center text-2xl rounded-lg p-2 bg-white/30 border border-white/30 focus:outline-none"
            placeholder="----"
            inputMode="numeric"
          />
        </div>

        {error && <p className="mt-3 text-sm text-red-200">{error}</p>}

        <p className="mt-4 text-xs text-gray-200">Hint: It's a special date we both love.</p>
      </div>
    </div>
  );
}
