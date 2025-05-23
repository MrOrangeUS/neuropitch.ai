// LeadScorerInputForm.jsx (Enhanced Version)
import React, { useState } from 'react';

export default function LeadScorerInputForm() {
  const [lead, setLead] = useState({
    name: '',
    title: '',
    company: '',
    industry: '',
    revenue: '',
    intent: ''
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLead({ ...lead, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setLead({ name: '', title: '', company: '', industry: '', revenue: '', intent: '' });
    setResult(null);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/score-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leads: [lead] })
      });
      const data = await res.json();
      setResult(data.results[0]);
    } catch (err) {
      console.error('Scoring failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-4xl font-bold mb-8">Lead Scorer</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-xl">
        {Object.entries(lead).map(([key, value]) => (
          <div key={key} className="flex flex-col">
            <label className="text-sm mb-1 text-gray-300 capitalize">{key}</label>
            <input
              name={key}
              value={value}
              onChange={handleChange}
              placeholder={`Enter ${key}`}
              className="p-2 rounded bg-gray-800 border border-gray-700"
              required
            />
          </div>
        ))}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-white text-black px-4 py-2 font-semibold rounded hover:bg-gray-300"
          >
            {loading ? 'Scoring...' : 'Score Lead'}
          </button>
          {result && (
            <button
              type="button"
              onClick={handleReset}
              className="bg-gray-700 text-white px-4 py-2 font-semibold rounded hover:bg-gray-600"
            >
              Reset
            </button>
          )}
        </div>
      </form>

      {result && (
        <div className="mt-10 p-6 bg-gray-800 rounded shadow border border-gray-700 max-w-xl">
          <p className="text-xl font-bold mb-1">
            {result.name}{' '}
            <span className="text-gray-400">
              ({result.title} at {result.company})
            </span>
          </p>
          <p className={`text-lg font-semibold mb-2 ${getScoreColor(result.score)}`}>
            Score: {result.score}
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">Reason: {result.reason}</p>
        </div>
      )}
    </div>
  );
}
