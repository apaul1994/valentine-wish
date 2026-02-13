import React from 'react';

export default function Header() {
  return (
    <header className="sticky top-4 z-30 backdrop-blur glass px-4 py-3 rounded-2xl mx-2">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-dancing text-valent-700">Mitu ❤️</div>
          <div className="text-sm text-gray-800">A surprise from <span className="font-dancing">Subho</span></div>
        </div>
        <nav className="space-x-4 text-sm">
          <a href="#our-story" className="text-gray-800 hover:text-valent-700">Our Story</a>
          <a href="#reasons" className="text-gray-800 hover:text-valent-700">Reasons Why</a>
          <a href="#invite" className="text-gray-800 hover:text-valent-700">Date Invite</a>
          <a href="#gallery" className="text-gray-800 hover:text-valent-700">Gallery</a>
        </nav>
      </div>
    </header>
  );
}
