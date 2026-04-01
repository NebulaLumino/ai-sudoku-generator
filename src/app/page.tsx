"use client";

import { useState } from "react";

type FormData = {
  puzzleType: "Sudoku",
  difficulty: "Easy",
  size: "Small (6x6)",
  theme: "",
  includeSolution: "Yes"
};

export default function Home() {
  const [formData, setFormData] = useState<FormData>({
  puzzleType: "Sudoku",
  difficulty: "Easy",
  size: "Small (6x6)",
  theme: "",
  includeSolution: "Yes"
});
  const [result, setResult] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData, systemPrompt: '' + sp_esc + '' }),
      });
      const data = await res.json();
      if (data.error) { setError(data.error); return; }
      setResult(data.result || "");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100">
      <div className="max-w-4xl mx-auto p-6">
        <header className="mb-8">
          <h1 className={"text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-600 bg-clip-text text-transparent"}>
            {'' + title_esc + ''}
          </h1>
          <p className="text-zinc-400 mt-2 text-sm">Fill in the options below and generate your game content instantly.</p>
        </header>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
              <div className="space-y-4">
<div><label className="block text-sm font-medium text-zinc-300 mb-1.5">Puzzle Type</label><select name="puzzleType" value={formData.puzzleType} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-zinc-200">{['Sudoku','Crossword','Logic Grid','Masyu','Hitori'].map(o=><option key={o} value={o}>{o}</option>)}</select></div>
<div><label className="block text-sm font-medium text-zinc-300 mb-1.5">Difficulty</label><select name="difficulty" value={formData.difficulty} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-zinc-200">{['Easy','Medium','Hard','Expert'].map(o=><option key={o} value={o}>{o}</option>)}</select></div>
<div><label className="block text-sm font-medium text-zinc-300 mb-1.5">Size Preference</label><select name="size" value={formData.size} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-zinc-200">{['Small (6x6)','Standard (9x9)','Large (12x12)','Expert (16x16)'].map(o=><option key={o} value={o}>{o}</option>)}</select></div>
<div><label className="block text-sm font-medium text-zinc-300 mb-1.5">Theme / Word List</label><textarea name="theme" value={formData.theme} onChange={handleChange} placeholder="For crosswords: topic or word list..." rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-zinc-200 resize-none" /></div>
<div><label className="block text-sm font-medium text-zinc-300 mb-1.5">Include Solution</label><select name="includeSolution" value={formData.includeSolution} onChange={handleChange} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 text-zinc-200">{['Yes','No - puzzle only'].map(o=><option key={o} value={o}>{o}</option>)}</select></div>
              </div>
              <button
                type="submit"
                disabled={isGenerating}
                className={"w-full bg-teal-600 hover:opacity-90 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl transition-all text-sm"}
              >
                {isGenerating ? "Generating..." : "Generate Content"}
              </button>
              {error && (
                <p className="text-red-400 text-sm bg-red-500/10 rounded-lg p-2">{error}</p>
              )}
            </form>
          </div>

          <div className="lg:col-span-3">
            {result ? (
              <div className={"bg-teal-500/10 border border-zinc-800 rounded-2xl p-5"}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={"font-semibold text-teal-400"}>Generated Result</h2>
                  <button
                    onClick={() => navigator.clipboard.writeText(result)}
                    className="text-xs text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded bg-zinc-800"
                  >
                    Copy
                  </button>
                </div>
                <div className="prose prose-invert prose-sm max-w-none text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {result}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600 border-2 border-dashed border-zinc-800 rounded-2xl p-12 min-h-96">
                <span className="text-4xl mb-4">&#127918;</span>
                <p className="text-center text-sm">Your generated game content will appear here.</p>
                <p className="text-center text-xs text-zinc-700 mt-2">Fill out the form and click Generate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
