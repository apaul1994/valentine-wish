import React, { useState, useRef } from 'react';

export default function DateInvite() {
  const [answer, setAnswer] = useState(null);
  const noRef = useRef(null);

  function handleYes() {
    setAnswer(true);
  }

  function handleNoEnter(e) {
    // move the No button to a random position within the parent when hovered
    const btn = noRef.current;
    if (!btn) return;
    const parent = btn.parentElement.getBoundingClientRect();
    const x = Math.random() * (parent.width - btn.offsetWidth);
    const y = Math.random() * (parent.height - btn.offsetHeight);
    btn.style.transform = `translate(${x}px, ${y}px)`;
  }

  return (
    <div className="glass p-6 rounded-2xl max-w-md mx-auto text-center">
      {!answer && (
        <div className="flex flex-col items-center space-y-4">
          <div className="text-sm text-gray-700">Would you like to go on a date with me?</div>
          <div className="relative w-full h-24">
            <button onClick={handleYes} className="absolute left-1/4 top-1/3 bg-valent-500 text-white px-6 py-2 rounded-full">Yes</button>
            <button
              ref={noRef}
              onMouseEnter={handleNoEnter}
              className="absolute left-3/4 top-1/3 bg-gray-300 text-gray-700 px-6 py-2 rounded-full"
            >No</button>
          </div>
          <div className="text-xs text-gray-500">Move the cursor to the No button and see what happens 😄</div>
        </div>
      )}

      {answer === true && (
        <div className="text-valent-700 font-dancing text-xl">Yay! I can't wait, Mitu 💕</div>
      )}
    </div>
  );
}
