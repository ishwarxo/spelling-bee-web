import React from 'react';

function LetterGrid({ letters, centralLetter }) {
  if (!letters || !centralLetter) return null;

  const outerLetters = letters.split('').filter(l => l.toLowerCase() !== centralLetter.toLowerCase());
  return (
    <div className="relative w-40 h-40 flex items-center justify-center mt-4">
      <div className="absolute text-2xl font-bold bg-yellow-300 rounded-full w-12 h-12 flex items-center justify-center">
        {centralLetter.toUpperCase()}
      </div>
      {outerLetters.map((letter, i) => {
        const angle = (i * 60) * (Math.PI / 180);
        const x = 60 * Math.cos(angle);
        const y = 60 * Math.sin(angle);
        return (
          <div
            key={letter}
            className="absolute text-xl bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center"
            style={{ transform: `translate(${x}px, ${y}px)` }}
          >
            {letter.toUpperCase()}
          </div>
        );
      })}
    </div>
  );
}

export default LetterGrid;