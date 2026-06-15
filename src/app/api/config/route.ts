import { NextResponse } from 'next/server';

export async function GET() {
  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasAnthropic = !!process.env.ANTHROPIC_API_KEY;
  const hasOllama = !!process.env.OLLAMA_MODEL;

  let provider = 'Demo Mode';
  if (hasOllama) {
    provider = `Ollama (${process.env.OLLAMA_MODEL})`;
  } else if (hasGemini) {
    provider = 'Gemini';
  } else if (hasAnthropic) {
    provider = 'Claude';
  }

  return NextResponse.json({
    isDemo: !hasGemini && !hasAnthropic && !hasOllama,
    hasOllama,
    hasGemini,
    hasAnthropic,
    provider
  });
}
