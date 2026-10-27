import { useEffect, useMemo, useState } from "react";
import StringTensionCalculator from "../StringTensionCalculator.jsx";
import TensionTranslator from "../TensionTranslator.jsx";
import { INSTRUMENTS } from "./lib/tension.js";

const MODES = ["calculator", "translator"];

const LANGUAGES = [
  { key: "en", label: "EN", htmlLang: "en" },
  { key: "zh", label: "中文", htmlLang: "zh-CN" },
];

const LANG_STORAGE_KEY = "string-tension-calculator:lang";
const INSTRUMENT_STORAGE_KEY = "string-tension-calculator:instrument";

// Tuning preset names (Standard, Drop D, ...) and note names stay in English in every language.
const STRINGS = {
  en: {
    pageTitle: "String Tension Calculator",
    modes: { calculator: "Calculator", translator: "Translation Guide" },
    instruments: { guitar: "Guitar", bass: "Bass" },
    multiscale: "Multiscale",
    trebleScale: "Treble",
    bassScale: "Bass",
    stringCount: "String Count",
    tuningPreset: "Tuning Preset",
    custom: "Custom",
    increase: (label) => `Increase ${label}`,
    decrease: (label) => `Decrease ${label}`,
    pitchLabel: (stringNumber) => `string ${stringNumber} pitch`,
    gaugeLabel: (stringNumber) => `string ${stringNumber} gauge`,
    allPitchLabel: "all strings' pitch",
    allGaugeLabel: "all strings' gauges",
    calcTitle: "String Tension Calculator",
    calcSubtitle: "Multiscale calculation supported, and unit mass weight based on D'Addario's published data.",
    totalTension: "Total Tension",
    countResetNote: "Changing count resets notes, gauges, and types to the default set.",
    scaleIn: "Scale (in)",
    breakdownTitle: "Per-string breakdown",
    breakdownNote: "Unit weight resolves via embedded lookup first, then power-law fallback.",
    breakdownHint: "Swipe horizontally on mobile. Rows are highlighted when tension is more than 10% from the set mean.",
    colString: "String",
    colNote: "Note",
    colGauge: "Gauge",
    colType: "Type",
    colScale: "Scale",
    colTension: "Tension",
    colKg: "Kg",
    trebleSide: "Treble Side",
    bassSide: "Bass Side",
    imbalance: "Imbalance",
    transTitle: "Tension Translation Guide",
    transDescription:
      "Match the feel of one guitar on another. Enter your reference setup, describe the target guitar's scale and tuning, and get gauge recommendations that match the reference's string-by-string tensions.",
    reference: "Reference",
    target: "Target",
    referenceTag: "input",
    targetTag: "tuning + scale only",
    scale: "Scale",
    recTitle: "Recommended target gauges",
    recNote:
      "Search prefers tabulated D'Addario gauges; falls back to power-law inference when the closest tabulated gauge is at the edge of the table.",
    colRefNote: "Ref Note",
    colRefGauge: "Ref Gauge",
    colRefTension: "Ref T",
    colTargetNote: "Tgt Note",
    colRecGauge: "Rec Gauge",
    colTargetTension: "Tgt T",
    extrapolated: "extrapolated",
    noRefDefault: "no ref · default",
    // Bass mode replaces these entries.
    bass: {
      calcSubtitle:
        "Multiscale calculation supported. Bass unit weights blend Kalium and D'Addario data (estimate, ±5%).",
      breakdownNote: "Wound unit weights come from a blended Kalium + D'Addario curve (±5%).",
      recNote:
        "Picks the closest gauge Kalium sells as a single string, using the blended bass unit weights (±5%); falls back to a continuous estimate outside that range.",
    },
  },
  zh: {
    pageTitle: "琴弦张力计算器",
    modes: { calculator: "张力计算器", translator: "张力换算" },
    instruments: { guitar: "吉他", bass: "贝斯" },
    multiscale: "扇品",
    trebleScale: "高音侧弦长",
    bassScale: "低音侧弦长",
    stringCount: "弦数",
    tuningPreset: "调弦预设",
    custom: "自定义",
    increase: (label) => `调高${label}`,
    decrease: (label) => `调低${label}`,
    pitchLabel: (stringNumber) => `${stringNumber} 弦音高`,
    gaugeLabel: (stringNumber) => `${stringNumber} 弦规格`,
    allPitchLabel: "全部弦音高",
    allGaugeLabel: "全部弦规格",
    calcTitle: "琴弦张力计算器",
    calcSubtitle: "支持扇品计算，单位重量基于达达里奥（D'Addario）公开数据。",
    totalTension: "总张力",
    countResetNote: "切换弦数会将音名、规格和类型重置为默认值。",
    scaleIn: "有效弦长（英寸）",
    breakdownTitle: "逐弦明细",
    breakdownNote: "单位重量优先查内置数据表，查不到时用幂律公式估算。PL = 裸弦，NW = 镍缠弦。",
    breakdownHint: "手机上可左右滑动表格。张力偏离整套平均值超过 10% 的行会高亮显示。",
    colString: "弦",
    colNote: "音名",
    colGauge: "规格",
    colType: "类型",
    colScale: "弦长",
    colTension: "张力",
    colKg: "千克",
    trebleSide: "高音侧",
    bassSide: "低音侧",
    imbalance: "张力差",
    transTitle: "张力换算指南",
    transDescription:
      "把一把吉他的手感迁移到另一把上。输入参考琴的配置，设置目标琴的有效弦长和调弦，即可得到与参考琴逐弦张力相匹配的推荐规格。",
    reference: "参考琴",
    target: "目标琴",
    referenceTag: "输入",
    targetTag: "仅调弦 + 弦长",
    scale: "有效弦长",
    recTitle: "目标琴推荐规格",
    recNote: "优先在达达里奥数据表中搜索规格；若最接近的规格位于表格边缘，则改用幂律公式外推。PL = 裸弦，NW = 镍缠弦。",
    colRefNote: "参考音名",
    colRefGauge: "参考规格",
    colRefTension: "参考张力",
    colTargetNote: "目标音名",
    colRecGauge: "推荐规格",
    colTargetTension: "目标张力",
    extrapolated: "外推估算",
    noRefDefault: "无参考 · 默认",
    bass: {
      calcSubtitle: "支持扇品计算。贝斯单位重量综合 Kalium 与达达里奥数据（估算，±5%）。",
      breakdownNote: "缠弦单位重量来自 Kalium 与达达里奥数据的综合曲线（±5%）。PL = 裸弦，NW = 镍缠弦。",
      recNote:
        "在 Kalium 单根弦规格中选取最接近的规格，基于综合贝斯单位重量（±5%）；超出范围时改用连续估算。PL = 裸弦，NW = 镍缠弦。",
    },
  },
};

function detectInitialLang() {
  try {
    const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (stored in STRINGS) return stored;
  } catch {
    // Storage can be unavailable (private mode, blocked site data).
  }

  return navigator.language?.toLowerCase().startsWith("zh") ? "zh" : "en";
}

function detectInitialInstrument() {
  try {
    const stored = window.localStorage.getItem(INSTRUMENT_STORAGE_KEY);
    if (stored in INSTRUMENTS) return stored;
  } catch {
    // Storage can be unavailable (private mode, blocked site data).
  }

  return "guitar";
}

export default function App() {
  const [mode, setMode] = useState("calculator");
  const [lang, setLang] = useState(detectInitialLang);
  const [instrument, setInstrument] = useState(detectInitialInstrument);
  const t = useMemo(
    () => (instrument === "bass" ? { ...STRINGS[lang], ...STRINGS[lang].bass } : STRINGS[lang]),
    [lang, instrument],
  );

  useEffect(() => {
    document.documentElement.lang = LANGUAGES.find((option) => option.key === lang).htmlLang;
    document.title = t.pageTitle;

    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Ignore: the choice just won't persist.
    }
  }, [lang, t]);

  useEffect(() => {
    try {
      window.localStorage.setItem(INSTRUMENT_STORAGE_KEY, instrument);
    } catch {
      // Ignore: the choice just won't persist.
    }
  }, [instrument]);

  return (
    <div className="min-h-screen bg-[#0f0f0f]">
      <nav className="border-b border-[#1a1a1a] bg-[#0f0f0f]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-3 pt-4 pb-3 sm:px-6 sm:pt-5 lg:px-8">
          <div className="flex gap-1.5 rounded-2xl border border-[#2a2a2a] bg-[#111111] p-1">
            {Object.keys(INSTRUMENTS).map((key) => {
              const active = key === instrument;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setInstrument(key)}
                  aria-pressed={active}
                  className={`whitespace-nowrap rounded-xl px-2.5 py-1.5 text-sm font-medium transition sm:px-4 ${
                    active
                      ? "bg-[#14b8a6]/15 text-[#ccfbf1]"
                      : "text-[#9ca3af] hover:text-[#e5e5e5]"
                  }`}
                >
                  {t.instruments[key]}
                </button>
              );
            })}
          </div>

          <div className="flex gap-1.5 rounded-2xl border border-[#2a2a2a] bg-[#111111] p-1">
            {MODES.map((key) => {
              const active = key === mode;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMode(key)}
                  aria-pressed={active}
                  className={`whitespace-nowrap rounded-xl px-2.5 py-1.5 text-sm font-medium transition sm:px-4 ${
                    active
                      ? "bg-[#14b8a6]/15 text-[#ccfbf1]"
                      : "text-[#9ca3af] hover:text-[#e5e5e5]"
                  }`}
                >
                  {t.modes[key]}
                </button>
              );
            })}
          </div>

          <div className="flex gap-1 rounded-2xl border border-[#2a2a2a] bg-[#111111] p-1">
            {LANGUAGES.map((option) => {
              const active = option.key === lang;
              return (
                <button
                  key={option.key}
                  type="button"
                  lang={option.htmlLang}
                  onClick={() => setLang(option.key)}
                  aria-pressed={active}
                  className={`whitespace-nowrap rounded-xl px-2 py-2 text-xs font-medium transition sm:px-2.5 ${
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

      {mode === "calculator" ? (
        <StringTensionCalculator key={instrument} t={t} instrument={INSTRUMENTS[instrument]} />
      ) : (
        <TensionTranslator key={instrument} t={t} instrument={INSTRUMENTS[instrument]} />
      )}
    </div>
  );
}
