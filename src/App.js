import React, { useState } from 'react';
import './index.css';
import Gate from './components/Gate';
import Header from './components/Header';
import Timeline from './components/Timeline';
import Reasons from './components/Reasons';
import DateInvite from './components/DateInvite';
import Gallery from './components/Gallery';
import FloatingHearts from './components/FloatingHearts';

function App() {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 via-pink-200 to-red-200 relative overflow-hidden">
      <FloatingHearts />
      <div className="backdrop-blur-sm min-h-screen">
        {!unlocked && <Gate onUnlock={() => setUnlocked(true)} />}

        {unlocked && (
          <div className="max-w-4xl mx-auto p-4">
            <Header />
            <main className="space-y-8 mt-6 pb-24">
              <section id="reasons">
                <h2 className="text-3xl text-center font-dancing text-valent-700 mb-4">Reasons Why I Love You</h2>
                <Reasons />
              </section>

              <section id="invite">
                <h2 className="text-3xl text-center font-dancing text-valent-700 mb-4">Will you go on a date with me?</h2>
                <DateInvite />
              </section>

              <section id="gallery">
                <h2 className="text-3xl text-center font-dancing text-valent-700 mb-4">Gallery</h2>
                <Gallery />
              </section>

              <section id="our-story">
                <h2 className="text-4xl text-center font-dancing text-valent-700 mb-4">Our Story — Mitu & Subho</h2>
                <Timeline />
              </section>
            </main>
            <footer className="text-center text-sm text-gray-700 mt-12 mb-8">With love, <span className="font-dancing text-valent-700">Subho</span> ❤️</footer>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
