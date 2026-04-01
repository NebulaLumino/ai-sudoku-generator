"use client";
import { useState } from "react";

export default function Page() {
  const [formData, setFormData] = useState<Record<string, string>>({
      "difficulty": "1 - Easy",
      "variant": "Classic 9x9",
      "gridSize": "4x4 (Beginner)",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
        difficulty: formData["difficulty"],
        variant: formData["variant"],
        gridSize: formData["gridSize"],
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setResult(data.result);
    } catch { setError("Failed to generate content."); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-950 via-slate-900 to-teal-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-teal-400 to-teal-200 bg-clip-text text-transparent">
            🔢 AI Sudoku Generator
          </h1>
          <p className="text-slate-400">Generate Sudoku puzzles in all difficulty levels</p>
        </header>

        <form onSubmit={handleGenerate} className="bg-slate-800/60 backdrop-blur rounded-2xl p-6 mb-8 border border-teal-500/20 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-teal-300 mb-2">Difficulty</label>
              <select value={formData["difficulty"]} onChange={e => setFormData({...formData, "difficulty": e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                {Array.from({length: 5}).map((_, i) => <option key={i}>{["1 - Easy", "2 - Medium", "3 - Hard", "4 - Expert", "5 - Extreme"]}[i]</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-teal-300 mb-2">Variant</label>
              <select value={formData["variant"]} onChange={e => setFormData({...formData, "variant": e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                {Array.from({length: 8}).map((_, i) => <option key={i}>{["Classic 9x9", "Mini 4x4", "Super 16x16", "Diagonal (X)", "Irregular", "Killer Sudoku", "Greater Than", "Samurai"]}[i]</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-teal-300 mb-2">Grid Size</label>
              <select value={formData["gridSize"]} onChange={e => setFormData({...formData, "gridSize": e.target.value})}
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-teal-500">
                {Array.from({length: 5}).map((_, i) => <option key={i}>{["4x4 (Beginner)", "6x6 (Kids)", "9x9 (Standard)", "12x12 (Intermediate)", "16x16 (Advanced)"]}[i]</option>)}
              </select>
            </div>          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 rounded-xl font-semibold text-white transition-all disabled:opacity-50">
            {loading ? "Generating..." : "🔢 Generate"}
          </button>
        </form>

        {error && <div className="bg-red-900/40 border border-red-500/40 rounded-xl p-4 text-red-300 mb-6">{error}</div>}

        {result && (
          <div className="bg-slate-800/60 backdrop-blur rounded-2xl p-6 border border-teal-500/20">
            <h2 className="text-xl font-bold text-teal-300 mb-4">Generated Content</h2>
            <div className="whitespace-pre-wrap text-slate-200 leading-relaxed">{result}</div>
          </div>
        )}
      </div>
    </main>
  );
}
