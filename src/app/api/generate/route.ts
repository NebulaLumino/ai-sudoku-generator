import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { difficulty, variant, gridSize } = await req.json();
    const prompt = `You are a Sudoku puzzle mathematician. Generate ${difficulty} Sudoku puzzles:
- **Variant:** ${variant}
- **Grid Size:** ${gridSize}

For each puzzle provide: 1) Puzzle Number, 2) The puzzle grid (use text format), 3) Solution grid, 4) Difficulty breakdown (why it is ${difficulty}), 5) Solving techniques required. Create varied and interesting puzzles.`;
    const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "deepseek-chat", messages: [
        { role: "system", content: "You are a puzzle mathematician specializing in Sudoku variants." },
        { role: "user", content: prompt }
      ], temperature: 0.9, max_tokens: 2000 }),
    });
    if (!response.ok) return NextResponse.json({ error: await response.text() }, { status: response.status });
    const data = await response.json();
    return NextResponse.json({ result: data.choices?.[0]?.message?.content || "No response." });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Unknown error" }, { status: 500 });
  }
}
