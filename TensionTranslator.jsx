import React, { useReducer } from "react";
import {
  STRING_COUNT_OPTIONS,
  DEFAULT_GAUGES,
  DEFAULT_PRESET_BY_COUNT,
  NOTE_OPTIONS,
  TUNING_PRESETS,
  buildStringsForCount,
  calculateTension,
  detectPresetKey,
  formatGaugeDisplay,
  formatNumber,
  gaugeStepForString,
  getPresetByKey,
  interpolateScale,
  midiToFrequency,
  midiToLabel,
  noteToMidi,
  normalizeGaugeInput,
  parseOptionalNumber,
  recommendGauge,
  resolveUnitWeight,
  toKg,
} from "./src/lib/tension.js";

function buildSideStrings(count, { withGauges }) {
  const preset = getPresetByKey(count, DEFAULT_PRESET_BY_COUNT[count]);

  return preset.notes.map((note, index) => {
    const base = {
      midi: noteToMidi(note),
      type: index < 3 ? "PL" : "NW",
    };

    return withGauges ? { ...base, gaugeInput: DEFAULT_GAUGES[count][index] } : base;
  });
}

function resizeStrings(currentStrings, nextCount, { withGauges }) {
  if (currentStrings.length === nextCount) {
    return currentStrings;
  }

  if (currentStrings.length > nextCount) {
    return currentStrings.slice(0, nextCount);
  }

  const preset = getPresetByKey(nextCount, DEFAULT_PRESET_BY_COUNT[nextCount]);
  const filled = [...currentStrings];

  for (let index = currentStrings.length; index < nextCount; index += 1) {
    const note = preset.notes[index];
    const next = {
      midi: noteToMidi(note),
      type: index < 3 ? "PL" : "NW",
    };

    filled.push(withGauges ? { ...next, gaugeInput: DEFAULT_GAUGES[nextCount][index] } : next);
  }

  return filled;
}

function buildInitialState() {
  return {
    refCount: 6,
    targetCount: 6,
    targetCountLinked: true,
    reference: {
      scaleTreble: "25.5",
      scaleBass: "25.5",
      tuningPreset: DEFAULT_PRESET_BY_COUNT[6],
      strings: buildStringsForCount(6),
    },
    target: {
      scaleTreble: "25.5",
      scaleBass: "25.5",
      tuningPreset: DEFAULT_PRESET_BY_COUNT[6],
      strings: buildSideStrings(6, { withGauges: false }),
    },
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "setRefCount": {
      const nextCount = action.value;
      if (nextCount === state.refCount) return state;

      const reference = {
        ...state.reference,
        strings: resizeStrings(state.reference.strings, nextCount, { withGauges: true }),
      };
      reference.tuningPreset = detectPresetKey(nextCount, reference.strings);

      const next = { ...state, refCount: nextCount, reference };

      if (state.targetCountLinked) {
        const target = {
          ...state.target,
          strings: resizeStrings(state.target.strings, nextCount, { withGauges: false }),
        };
        target.tuningPreset = detectPresetKey(nextCount, target.strings);
        next.target = target;
        next.targetCount = nextCount;
      }

      return next;
    }

    case "setTargetCount": {
      const nextCount = action.value;
      if (nextCount === state.targetCount) return state;

      const target = {
        ...state.target,
        strings: resizeStrings(state.target.strings, nextCount, { withGauges: false }),
      };
      target.tuningPreset = detectPresetKey(nextCount, target.strings);

      return {
        ...state,
        targetCount: nextCount,
        target,
        targetCountLinked: nextCount === state.refCount,
      };
    }

    case "setSideField": {
      const side = action.side;
      return {
        ...state,
        [side]: { ...state[side], [action.key]: action.value },
      };
    }

    case "setSidePreset": {
      const side = action.side;
      const count = side === "reference" ? state.refCount : state.targetCount;
      if (action.value === "custom") return state;

      const preset = getPresetByKey(count, action.value);
      const sideState = state[side];

      return {
        ...state,
        [side]: {
          ...sideState,
          tuningPreset: preset.key,
          strings: sideState.strings.map((stringState, index) => ({
            ...stringState,
            midi: noteToMidi(preset.notes[index]),
          })),
        },
      };
    }

    case "setSideStringField": {
      const side = action.side;
      const sideState = state[side];
      const count = side === "reference" ? state.refCount : state.targetCount;

      const strings = sideState.strings.map((stringState, index) =>
        index === action.index ? { ...stringState, [action.key]: action.value } : stringState,
      );

      const tuningPreset =
        action.key === "midi" ? detectPresetKey(count, strings) : sideState.tuningPreset;

      return {
        ...state,
        [side]: { ...sideState, strings, tuningPreset },
      };
    }

    default:
      return state;
  }
}

function buildSideRows(side, count, sideState) {
  const scaleTreble = parseOptionalNumber(sideState.scaleTreble);
  const scaleBass = parseOptionalNumber(sideState.scaleBass);

  return sideState.strings.map((stringState, index) => {
    const scaleLength = interpolateScale(index, count, scaleTreble, scaleBass);
    const frequency = midiToFrequency(stringState.midi);
    const gaugeInput = stringState.gaugeInput;
    const gaugeThousandths =
      gaugeInput !== undefined ? normalizeGaugeInput(gaugeInput) : null;
    const { unitWeight } =
      gaugeThousandths !== null
        ? resolveUnitWeight(gaugeThousandths, stringState.type)
        : { unitWeight: 0 };
    const tensionLbs =
      gaugeThousandths !== null ? calculateTension(unitWeight, scaleLength, frequency) : 0;

    return {
      index,
      stringNumber: index + 1,
      midi: stringState.midi,
      noteLabel: midiToLabel(stringState.midi),
      frequency,
      gaugeInput,
      gaugeThousandths,
      type: stringState.type,
      scaleLength,
      unitWeight,
      tensionLbs,
    };
  });
}

function deltaToneClass(deltaLbs) {
  if (!Number.isFinite(deltaLbs)) return "text-[#9ca3af]";
  return Math.abs(deltaLbs) < 0.5 ? "text-[#9ca3af]" : "text-amber-400";
}

export default function TensionTranslator() {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);

  const refRows = buildSideRows("reference", state.refCount, state.reference);
  const targetRows = buildSideRows("target", state.targetCount, state.target);

  const recommendationRows = targetRows.map((targetRow) => {
    const refRow = targetRow.index < state.refCount ? refRows[targetRow.index] : null;
    const referenceTensionLbs = refRow ? refRow.tensionLbs : null;

    if (!refRow || !Number.isFinite(referenceTensionLbs) || referenceTensionLbs <= 0) {
      const fallbackGauge = DEFAULT_GAUGES[state.targetCount][targetRow.index];
      const fallbackThousandths = normalizeGaugeInput(fallbackGauge);
      const fallbackUnitWeight =
        fallbackThousandths !== null
          ? resolveUnitWeight(fallbackThousandths, targetRow.type).unitWeight
          : 0;
      const fallbackTension = calculateTension(
        fallbackUnitWeight,
        targetRow.scaleLength,
        targetRow.frequency,
      );

      return {
        targetRow,
        refRow,
        recommendation: {
          gauge: fallbackThousandths,
          unitWeight: fallbackUnitWeight,
          tensionLbs: fallbackTension,
          deltaLbs: NaN,
          source: "default",
          outOfRange: false,
        },
        noReference: true,
      };
    }

    const recommendation = recommendGauge({
      referenceTensionLbs,
      targetScale: targetRow.scaleLength,
      targetFrequency: targetRow.frequency,
      type: targetRow.type,
    });

    return { targetRow, refRow, recommendation, noReference: false };
  });

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-3 py-5 text-[#e5e5e5] sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-[#14b8a6] sm:text-3xl">
            Tension Translation Guide
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-[#9ca3af]">
            Match the feel of one guitar on another. Enter your reference setup, describe the target
            guitar's scale and tuning, and get gauge recommendations that match the reference's
            string-by-string tensions.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <SidePanel
            title="Reference"
            accent="border-l-4 border-l-[#14b8a6]/50"
            count={state.refCount}
            countAction="setRefCount"
            sideKey="reference"
            sideState={state.reference}
            rows={refRows}
            withGauges
            dispatch={dispatch}
          />
          <SidePanel
            title="Target"
            accent="border-l-4 border-l-[#fbbf24]/40"
            count={state.targetCount}
            countAction="setTargetCount"
            sideKey="target"
            sideState={state.target}
            rows={targetRows}
            withGauges={false}
            dispatch={dispatch}
          />
        </div>

        <RecommendationTable rows={recommendationRows} />
      </div>
    </div>
  );
}

function SidePanel({
  title,
  accent,
  count,
  countAction,
  sideKey,
  sideState,
  rows,
  withGauges,
  dispatch,
}) {
  const presets = TUNING_PRESETS[count];

  return (
    <section
      className={`rounded-3xl border border-[#2a2a2a] bg-[#171717] p-4 ${accent}`}
    >
      <header className="mb-4 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-xs uppercase tracking-[0.18em] text-[#888]">
          {withGauges ? "input" : "tuning + scale only"}
        </p>
      </header>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="space-y-2 sm:col-span-2">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#888]">String Count</p>
          <div className="flex gap-1.5">
            {STRING_COUNT_OPTIONS.map((option) => {
              const active = option === count;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => dispatch({ type: countAction, value: option })}
                  className={`flex-1 rounded-xl border px-2 py-2 text-sm font-medium transition ${
                    active
                      ? "border-[#14b8a6] bg-[#14b8a6]/15 text-[#ccfbf1]"
                      : "border-[#2a2a2a] bg-[#111111] text-[#d4d4d4] hover:border-[#3f3f46]"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        <label className="space-y-2">
          <span className="block text-[11px] uppercase tracking-[0.18em] text-[#888]">
            Treble Scale
          </span>
          <input
            type="number"
            min="20"
            max="40"
            step="0.01"
            value={sideState.scaleTreble}
            onChange={(event) =>
              dispatch({
                type: "setSideField",
                side: sideKey,
                key: "scaleTreble",
                value: event.target.value,
              })
            }
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#111111] px-2.5 py-2 text-sm text-white outline-none transition focus:border-[#14b8a6]"
          />
        </label>

        <label className="space-y-2">
          <span className="block text-[11px] uppercase tracking-[0.18em] text-[#888]">
            Bass Scale
          </span>
          <input
            type="number"
            min="20"
            max="40"
            step="0.01"
            value={sideState.scaleBass}
            onChange={(event) =>
              dispatch({
                type: "setSideField",
                side: sideKey,
                key: "scaleBass",
                value: event.target.value,
              })
            }
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#111111] px-2.5 py-2 text-sm text-white outline-none transition focus:border-[#14b8a6]"
          />
        </label>

        <label className="col-span-2 space-y-2 sm:col-span-4">
          <span className="block text-[11px] uppercase tracking-[0.18em] text-[#888]">
            Tuning Preset
          </span>
          <select
            value={sideState.tuningPreset}
            onChange={(event) =>
              dispatch({ type: "setSidePreset", side: sideKey, value: event.target.value })
            }
            className="w-full rounded-xl border border-[#2a2a2a] bg-[#111111] px-2.5 py-2 text-sm text-white outline-none transition focus:border-[#14b8a6]"
          >
            {presets.map((preset) => (
              <option key={preset.key} value={preset.key}>
                {preset.label}
              </option>
            ))}
            {sideState.tuningPreset === "custom" ? <option value="custom">Custom</option> : null}
          </select>
        </label>
      </div>

      <div className="mt-4 space-y-2">
        {rows.map((row) => (
          <SideStringRow
            key={row.stringNumber}
            row={row}
            sideKey={sideKey}
            withGauges={withGauges}
            dispatch={dispatch}
          />
        ))}
      </div>
    </section>
  );
}

function SideStringRow({ row, sideKey, withGauges, dispatch }) {
  return (
    <div className="grid grid-cols-[2.25rem_1fr_auto_auto] items-center gap-2 rounded-xl border border-[#222222] bg-[#111111] px-2.5 py-2 sm:gap-3">
      <span className="font-mono text-xs text-[#9ca3af]">{row.stringNumber}</span>
      <select
        value={row.midi}
        onChange={(event) =>
          dispatch({
            type: "setSideStringField",
            side: sideKey,
            index: row.index,
            key: "midi",
            value: Number(event.target.value),
          })
        }
        className="w-full rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-2 py-1.5 text-sm text-white outline-none focus:border-[#14b8a6]"
      >
        {NOTE_OPTIONS.map((note) => (
          <option key={note.midi} value={note.midi}>
            {note.label}
          </option>
        ))}
      </select>
      {withGauges ? (
        <input
          type="number"
          inputMode="decimal"
          step={gaugeStepForString(row.index)}
          value={row.gaugeInput}
          onChange={(event) =>
            dispatch({
              type: "setSideStringField",
              side: sideKey,
              index: row.index,
              key: "gaugeInput",
              value: event.target.value,
            })
          }
          className="w-16 rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-2 py-1.5 text-right font-mono text-sm text-white outline-none focus:border-[#14b8a6] sm:w-20"
        />
      ) : (
        <span className="font-mono text-xs text-[#6b7280]">{formatNumber(row.frequency, 1)} Hz</span>
      )}
      <select
        value={row.type}
        onChange={(event) =>
          dispatch({
            type: "setSideStringField",
            side: sideKey,
            index: row.index,
            key: "type",
            value: event.target.value,
          })
        }
        className="w-14 rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-1.5 py-1.5 text-xs text-white outline-none focus:border-[#14b8a6] sm:w-16 sm:text-sm"
      >
        <option value="PL">PL</option>
        <option value="NW">NW</option>
      </select>
    </div>
  );
}

function RecommendationTable({ rows }) {
  return (
    <section className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#171717]">
      <header className="border-b border-[#2a2a2a] px-4 py-3">
        <h2 className="text-lg font-semibold text-white">Recommended target gauges</h2>
        <p className="text-sm text-[#888]">
          Search prefers tabulated D&apos;Addario gauges; falls back to power-law inference when the
          closest tabulated gauge is at the edge of the table.
        </p>
      </header>

      <div className="-mx-3 overflow-x-auto px-3 sm:mx-0 sm:px-0">
        <table className="min-w-[56rem] divide-y divide-[#2a2a2a] text-left text-sm sm:min-w-full">
          <thead className="bg-[#111111] text-xs uppercase tracking-[0.16em] text-[#888]">
            <tr>
              <th className="px-3 py-3 sm:px-4">#</th>
              <th className="px-3 py-3 sm:px-4">Ref Note</th>
              <th className="px-3 py-3 sm:px-4">Ref Gauge</th>
              <th className="px-3 py-3 sm:px-4">Ref T</th>
              <th className="px-3 py-3 sm:px-4">→</th>
              <th className="px-3 py-3 sm:px-4">Tgt Note</th>
              <th className="px-3 py-3 sm:px-4">Rec Gauge</th>
              <th className="px-3 py-3 sm:px-4">Tgt T</th>
              <th className="px-3 py-3 sm:px-4">Δ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222222]">
            {rows.map(({ targetRow, refRow, recommendation, noReference }) => {
              const recGaugeText = recommendation
                ? recommendation.source === "fallback"
                  ? formatNumber(recommendation.gauge, 1)
                  : formatGaugeDisplay(recommendation.gauge)
                : "--";
              const recTensionText = recommendation
                ? formatNumber(recommendation.tensionLbs)
                : "--";
              const deltaText = recommendation && Number.isFinite(recommendation.deltaLbs)
                ? `${recommendation.deltaLbs >= 0 ? "+" : ""}${formatNumber(recommendation.deltaLbs)}`
                : "—";
              const deltaClass = recommendation
                ? deltaToneClass(recommendation.deltaLbs)
                : "text-[#9ca3af]";

              return (
                <tr key={targetRow.stringNumber}>
                  <td className="px-3 py-3 font-mono text-[#d4d4d4] sm:px-4">{targetRow.stringNumber}</td>
                  <td className="px-3 py-3 sm:px-4">
                    {refRow ? (
                      <span className="font-mono text-[#d4d4d4]">{refRow.noteLabel}</span>
                    ) : (
                      <span className="text-[#6b7280]">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 font-mono sm:px-4">
                    {refRow && refRow.gaugeThousandths !== null ? (
                      <>
                        <span className="text-[#d4d4d4]">{formatGaugeDisplay(refRow.gaugeThousandths)}</span>
                        <span className="ml-1 text-[10px] uppercase text-[#6b7280]">{refRow.type}</span>
                      </>
                    ) : (
                      <span className="text-[#6b7280]">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 font-mono sm:px-4">
                    {refRow ? (
                      <span className="text-[#d4d4d4]">{formatNumber(refRow.tensionLbs)}</span>
                    ) : (
                      <span className="text-[#6b7280]">—</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-[#3f3f46] sm:px-4">→</td>
                  <td className="px-3 py-3 font-mono text-[#d4d4d4] sm:px-4">{targetRow.noteLabel}</td>
                  <td className="px-3 py-3 font-mono sm:px-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-white">{recGaugeText}</span>
                      <span className="flex flex-wrap gap-1 text-[10px] uppercase text-[#6b7280]">
                        <span>{targetRow.type}</span>
                        {recommendation?.source === "fallback" ? (
                          <span className="text-[#fbbf24]">extrapolated</span>
                        ) : null}
                        {noReference ? (
                          <span className="text-[#9ca3af]">no ref · default</span>
                        ) : null}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3 font-mono text-[#d4d4d4] sm:px-4">{recTensionText}</td>
                  <td className={`px-3 py-3 font-mono sm:px-4 ${deltaClass}`}>{deltaText}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
