import React, { useState } from 'react';
import confetti from 'canvas-confetti';

const REASONS = [
  'Your smile lights my day.',
  'You make ordinary moments magical.',
  'I love the way you laugh.',
  'You are my favorite hello and hardest goodbye.',
  'You make me a better person.'
];

export default function Reasons() {
  const [reason, setReason] = useState('');

  function pickReason() {
    const r = REASONS[Math.floor(Math.random() * REASONS.length)];
    setReason(r);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }

  return (
    <div className="flex flex-col items-center">
      <div className="glass p-6 rounded-2xl w-full max-w-xl text-center">
        <div className="text-lg mb-4">Click the heart to reveal a reason</div>
        <button onClick={pickReason} className="px-6 py-3 rounded-full bg-valent-500 text-white font-semibold shadow-md hover:scale-105 transition">
          Click for a Reason ❤️
        </button>

        {reason && (
          <div className="mt-6 text-xl text-valent-700 font-semibold">{reason}</div>
        )}
      </div>
    </div>
  );
}
