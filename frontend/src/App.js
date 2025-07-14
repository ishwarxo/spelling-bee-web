import React, { useState } from 'react';
import LetterGrid from './components/LetterGrid';
import InputForm from './components/InputForm';
import Results from './components/Results';
import './styles.css';

function App() {
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (letters, centralLetter) => {
    try {
      const response = await fetch('http://localhost:5000/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letters, centralLetter })
      });
      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setResults(null);
      } else {
        setResults(data);
        setError('');
      }
    } catch (err) {
      setError('Error connecting to the server.');
      setResults(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold mb-6 text-blue-600">Spelling Bee Solver</h1>
      <InputForm onSubmit={handleSubmit} />
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {results && <Results results={results} />}
    </div>
  );
}

export default App;