import React from 'react';
import { motion } from 'framer-motion';

// Create a simple classy SVG placeholder and return as data URI
function makePlaceholder(title, subtitle, colorA = '#ffd0d6', colorB = '#ff416c') {
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='600' height='400'>
    <defs>
      <linearGradient id='g' x1='0' x2='1'>
        <stop offset='0' stop-color='${colorA}' />
        <stop offset='1' stop-color='${colorB}' />
      </linearGradient>
      <filter id='f' x='-20%' y='-20%' width='140%' height='140%'>
        <feGaussianBlur stdDeviation='12' result='b' />
        <feBlend in='SourceGraphic' in2='b' />
      </filter>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)' rx='16' ry='16' />
    <g filter='url(#f)'>
      <circle cx='480' cy='80' r='100' fill='rgba(255,255,255,0.08)' />
      <circle cx='80' cy='320' r='120' fill='rgba(255,255,255,0.06)' />
    </g>
    <text x='30' y='200' font-size='36' fill='#fff' font-family='Dancing Script, serif'>${title}</text>
    <text x='30' y='240' font-size='18' fill='rgba(255,255,255,0.9)'>${subtitle}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const milestonesInit = [
  { date: '2022-04-14', title: 'First Met', img: makePlaceholder('First Met', '14 April 2022') },
  { date: '2023-02-14', title: 'First Valentine', img: makePlaceholder('First Valentine', '14 Feb 2023') },
  { date: '2024-12-15', title: 'Marriage', img: makePlaceholder('Marriage', '15 Dec 2024') },
  { date: '2024-12-24', title: 'First Trip', img: makePlaceholder('First Trip', '24 Dec 2024') },
];

export default function Timeline() {
  const [milestones] = React.useState(milestonesInit);

  return (
    <div className="space-y-6">
      {milestones.map((m, i) => (
        <motion.div
          key={m.date}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.12 }}
          className="glass p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center space-x-0 sm:space-x-4"
        >
          <div className="w-full sm:w-48 h-32 flex items-center justify-center rounded-lg bg-red-50 text-valent-700 font-semibold overflow-hidden">
            <img src={m.img} alt={m.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 mt-3 sm:mt-0">
            <div className="text-lg font-semibold">{m.title}</div>
            <div className="text-xs text-gray-600">{m.date}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
