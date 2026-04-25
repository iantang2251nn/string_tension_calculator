import { useState } from "react";
import StringTensionCalculator from "../StringTensionCalculator.jsx";
import TensionTranslator from "../TensionTranslator.jsx";

const MODES = [
  { key: "calculator", label: "Calculator" },
  { key: "translator", label: "Translation Guide" },
];

export default function App() {
  const [mode, setMode] = useState("calculator");

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <nav className="border-b border-[#1a1a1a] bg-[#0f0f0f]">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 pt-4 pb-3 sm:px-6 sm:pt-5 lg:px-8">
          <div className="flex gap-1.5 rounded-2xl border border-[#2a2a2a] bg-[#111111] p-1">
            {MODES.map((option) => {
              const active = option.key === mode;
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setMode(option.key)}
                  aria-pressed={active}
                  className={`rounded-xl px-3 py-1.5 text-sm font-medium transition sm:px-4 ${
                    active
                      ? "bg-[#14b8a6]/15 text-[#ccfbf1]"
                      : "text-[#9ca3af] hover:text-[#e5e5e5]"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {mode === "calculator" ? <StringTensionCalculator /> : <TensionTranslator />}
    </div>
  );
}
