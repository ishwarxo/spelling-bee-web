import React, { useState } from 'react';
import LetterGrid from './LetterGrid';

function InputForm({ onSubmit }) {
  const [letters, setLetters] = useState('');
  const [centralLetter, setCentralLetter] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!/^[a-zA-Z]{7}$/.test(letters)) {
      setErrorMessage('Please enter exactly 7 alphabetic letters.');
      return;
    }
    if (new Set(letters.toLowerCase()).size !== 7) {
      setErrorMessage('Letters must be unique (no duplicates).');
      return;
    }
    if (!/^[a-zA-Z]$/.test(centralLetter)) {
      setErrorMessage('Central letter must be a single alphabetic character.');
      return;
    }
    if (!letters.toLowerCase().includes(centralLetter.toLowerCase())) {
      setErrorMessage('Central letter must be one of the 7 letters.');
      return;
    }
    onSubmit(letters, centralLetter);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-2xl">
      <LetterGrid letters={letters} centralLetter={centralLetter} />
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">7 Unique Letters</label>
          <input
            type="text"
            value={letters}
            onChange={(e) => setLetters(e.target.value.toUpperCase())}
            className="w-full p-2 border rounded"
            placeholder="e.g., ABCDEFG"
            maxLength={7}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Central Letter</label>
          <input
            type="text"
            value={centralLetter}
            onChange={(e) => setCentralLetter(e.target.value.toUpperCase())}
            className="w-full p-2 border rounded"
            placeholder="e.g., E"
            maxLength={1}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Solve Puzzle
        </button>
      </form>
      {errorMessage && (<p className="text-red-500 mt-4 text-sm text-center">{errorMessage}</p>)}
    </div>
  );
}

export default InputForm;