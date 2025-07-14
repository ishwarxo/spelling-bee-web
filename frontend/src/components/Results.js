import React, { useState } from 'react';

function Results({ results }) {
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="mt-6 w-full max-w-2xl">
      <h2 className="text-2xl font-semibold mb-4">Results</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="mb-4">
          <p><strong>Total Words:</strong> {results.wordCount}</p>
          <p><strong>Pangrams:</strong> {results.pangramCount}</p>
          <p><strong>Total Score:</strong> {results.totalScore}</p>
          <p><strong>Maximum Score:</strong> {results.maxScore}</p>
          <p><strong>Rank:</strong> {results.rank}</p>
        </div>
        {Object.keys(results.wordsByLength).sort((a, b) => a - b).map(length => (
          <div key={length} className="mb-4">
            <button
              onClick={() => toggleSection(length)}
              className="w-full text-left font-semibold text-lg text-blue-600"
            >
              {length}-Letter Words ({results.wordsByLength[length].length})
            </button>
            {openSections[length] && (
              <ul className="ml-4 mt-2">
                {results.wordsByLength[length].sort().map(word => (
                  <li key={word} className="text-gray-700">
                    {word}{results.pangrams.includes(word) ? ' (Pangram)' : ''}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <div className="mb-4">
          <button
            onClick={() => toggleSection('pangrams')}
            className="w-full text-left font-semibold text-lg text-blue-600"
          >
            Pangrams ({results.pangramCount})
          </button>
          {openSections.pangrams && (
            <ul className="ml-4 mt-2">
              {results.pangrams.length ? (
                results.pangrams.sort().map(word => (
                  <li key={word} className="text-gray-700">
                    {word} ({word.length} letters)
                  </li>
                ))
              ) : (
                <li className="text-gray-700">None found</li>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Results;