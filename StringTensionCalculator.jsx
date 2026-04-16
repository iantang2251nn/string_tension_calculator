import React, { useReducer } from "react";

const STRING_COUNT_OPTIONS = [6, 7, 8, 9];
const DEFAULT_PRESET_BY_COUNT = {
  6: "standard-6",
  7: "standard-7",
  8: "standard-8",
  9: "standard-9",
};

const NOTE_LABELS = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
const NOTE_TO_SEMITONE = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

const NOTE_OPTIONS = Array.from({ length: 88 - 23 + 1 }, (_, index) => {
  const midi = index + 23;
  const octave = Math.floor(midi / 12) - 1;
  const label = `${NOTE_LABELS[midi % 12]}${octave}`;
  const frequency = 440 * 2 ** ((midi - 69) / 12);

  return {
    midi,
    label,
    frequency,
  };
});

const UNIT_WEIGHT_LOOKUP = {
  PL: {
    7: 0.00001085,
    8: 0.00001418,
    9: 0.00001794,
    9.5: 0.00001999,
    10: 0.00002215,
    10.5: 0.00002442,
    11: 0.0000268,
    12: 0.0000319,
    13: 0.00003744,
    14: 0.00004342,
    15: 0.00004984,
    16: 0.00005671,
    17: 0.00006402,
    18: 0.00007177,
    19: 0.00007997,
    20: 0.00008861,
    21: 0.00009769,
    22: 0.00010722,
    23: 0.00011719,
    24: 0.0001276,
    25: 0.00013846,
    26: 0.00014975,
  },
  NW: {
    17: 0.00005524,
    18: 0.00006215,
    19: 0.00006947,
    20: 0.00007495,
    21: 0.00008293,
    22: 0.00009184,
    23: 0.0000998,
    24: 0.00010857,
    25: 0.00011755,
    26: 0.00012671,
    27: 0.00013672,
    28: 0.00014666,
    29: 0.0001573,
    30: 0.00017236,
    31: 0.00017931,
    32: 0.00019347,
    33: 0.00020272,
    34: 0.0002159,
    35: 0.00022754,
    36: 0.00023964,
    37: 0.00025376,
    38: 0.00026471,
    39: 0.00027932,
    40: 0.00029573,
    41: 0.00031042,
    42: 0.00032279,
    43: 0.00034084,
    44: 0.00035182,
    45: 0.00037266,
    46: 0.00038216,
    47: 0.00040586,
    48: 0.00041382,
    49: 0.00043014,
    50: 0.00045828,
    51: 0.00047644,
    52: 0.00048109,
    53: 0.00051381,
    54: 0.00053838,
    55: 0.00055256,
    56: 0.00057598,
    57: 0.0005927,
    58: 0.00061328,
    59: 0.00064191,
    60: 0.00066542,
    61: 0.0006771,
    62: 0.00070697,
    63: 0.00072137,
    64: 0.00074984,
    65: 0.00076701,
    66: 0.00079889,
    67: 0.00081402,
    68: 0.00084614,
    69: 0.0008624,
    70: 0.00089304,
    71: 0.00091216,
    72: 0.00093755,
    73: 0.00096328,
    74: 0.00098869,
    75: 0.00101577,
    76: 0.00104253,
    77: 0.00106962,
    78: 0.00109706,
    79: 0.00112484,
    80: 0.00115011,
  },
};

const TUNING_PRESETS = {
  6: [
    { key: "standard-6", label: "Standard", notes: ["E4", "B3", "G3", "D3", "A2", "E2"] },
    { key: "drop-d", label: "Drop D", notes: ["E4", "B3", "G3", "D3", "A2", "D2"] },
    { key: "d-standard", label: "D Standard", notes: ["D4", "A3", "F3", "C3", "G2", "D2"] },
    { key: "drop-c", label: "Drop C", notes: ["D4", "A3", "F3", "C3", "G2", "C2"] },
    { key: "c-standard", label: "C Standard", notes: ["C4", "G3", "Eb3", "Bb2", "F2", "C2"] },
    { key: "eb-standard", label: "Eb Standard", notes: ["Eb4", "Bb3", "Gb3", "Db3", "Ab2", "Eb2"] },
  ],
  7: [
    { key: "standard-7", label: "Standard", notes: ["E4", "B3", "G3", "D3", "A2", "E2", "B1"] },
    { key: "drop-a-7", label: "Drop A", notes: ["E4", "B3", "G3", "D3", "A2", "E2", "A1"] },
    { key: "drop-g-sharp-7", label: "Drop G#", notes: ["E4", "B3", "G3", "D3", "A2", "E2", "G#1"] },
  ],
  8: [
    { key: "standard-8", label: "Standard", notes: ["E4", "B3", "G3", "D3", "A2", "E2", "B1", "F#1"] },
    { key: "drop-e-8", label: "Drop E", notes: ["E4", "B3", "G3", "D3", "A2", "E2", "B1", "E1"] },
    { key: "f-standard-8", label: "F Standard", notes: ["Eb4", "Bb3", "Gb3", "Db3", "Ab2", "Eb2", "Bb1", "F1"] },
  ],
  9: [
    {
      key: "standard-9",
      label: "Standard",
      notes: ["E4", "B3", "G3", "D3", "A2", "E2", "B1", "F#1", "C#1"],
    },
    {
      key: "drop-b-9",
      label: "Drop B",
      notes: ["E4", "B3", "G3", "D3", "A2", "E2", "B1", "F#1", "B0"],
    },
    {
      key: "b-standard-9",
      label: "B Standard",
      notes: ["D4", "A3", "F3", "C3", "G2", "D2", "A1", "E1", "B0"],
    },
  ],
};

const DEFAULT_GAUGES = {
  6: ["10", "13", "17", "26", "36", "46"],
  7: ["9.5", "12", "16", "24", "34", "44", "56"],
  8: ["9.5", "12", "16", "24", "34", "44", "56", "74"],
  9: ["9", "11", "16", "24", "32", "42", "54", "75", "90"],
};

function noteToMidi(note) {
  const match = /^([A-G](?:#|b)?)(-?\d+)$/.exec(note);

  if (!match) {
    throw new Error(`Unsupported note: ${note}`);
  }

  const [, name, octaveText] = match;
  const semitone = NOTE_TO_SEMITONE[name];
  const octave = Number(octaveText);

  return (octave + 1) * 12 + semitone;
}

function midiToLabel(midi) {
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTE_LABELS[midi % 12]}${octave}`;
}

function midiToFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

function toKg(lbs) {
  return lbs / 2.20462;
}

function normalizeGaugeInput(rawValue) {
  const trimmed = rawValue.trim();

  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return parsed < 1 ? parsed * 1000 : parsed;
}

function gaugeLookupKey(gaugeThousandths) {
  return Number(gaugeThousandths.toFixed(3)).toString();
}

function formatGaugeDisplay(gaugeThousandths) {
  if (!Number.isFinite(gaugeThousandths)) {
    return "--";
  }

  const decimals = Number.isInteger(gaugeThousandths) ? 3 : 4;
  return (gaugeThousandths / 1000).toFixed(decimals).replace(/^0/, "");
}

function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) {
    return "--";
  }

  return value.toFixed(digits);
}

function gaugeStepForString(index) {
  return index < 2 ? 0.5 : 1;
}

function parseOptionalNumber(rawValue) {
  if (rawValue.trim() === "") {
    return Number.NaN;
  }

  return Number(rawValue);
}

function resolveUnitWeight(gaugeThousandths, type) {
  if (!Number.isFinite(gaugeThousandths)) {
    return { unitWeight: 0, source: "invalid" };
  }

  const lookup = UNIT_WEIGHT_LOOKUP[type][gaugeLookupKey(gaugeThousandths)];

  if (lookup) {
    return { unitWeight: lookup, source: "lookup" };
  }

  const gaugeInches = gaugeThousandths / 1000;
  const unitWeight =
    type === "PL"
      ? 0.2217 * gaugeInches ** 2.0002
      : 0.1641 * gaugeInches ** 1.963;

  return { unitWeight, source: "fallback" };
}

function interpolateScale(index, count, scaleTreble, scaleBass) {
  if (count === 1) {
    return scaleTreble;
  }

  return scaleTreble + ((scaleBass - scaleTreble) * index) / (count - 1);
}

function calculateTension(unitWeight, scaleLength, frequency) {
  if (!Number.isFinite(unitWeight) || !Number.isFinite(scaleLength) || !Number.isFinite(frequency)) {
    return 0;
  }

  return (unitWeight * (2 * scaleLength * frequency) ** 2) / 386.4;
}

function getPresetByKey(count, key) {
  return TUNING_PRESETS[count].find((preset) => preset.key === key) ?? TUNING_PRESETS[count][0];
}

function detectPresetKey(count, strings) {
  const matchingPreset = TUNING_PRESETS[count].find((preset) =>
    preset.notes.every((note, index) => noteToMidi(note) === strings[index].midi),
  );

  return matchingPreset?.key ?? "custom";
}

function buildStringsForCount(count) {
  const preset = getPresetByKey(count, DEFAULT_PRESET_BY_COUNT[count]);

  return preset.notes.map((note, index) => ({
    midi: noteToMidi(note),
    gaugeInput: DEFAULT_GAUGES[count][index],
    type: index < 3 ? "PL" : "NW",
  }));
}

function buildInitialState() {
  return {
    stringCount: 6,
    scaleTreble: "25.5",
    scaleBass: "25.5",
    tuningPreset: DEFAULT_PRESET_BY_COUNT[6],
    strings: buildStringsForCount(6),
  };
}

function reducer(state, action) {
  switch (action.type) {
    case "setStringCount": {
      const nextCount = action.value;

      return {
        ...state,
        stringCount: nextCount,
        tuningPreset: DEFAULT_PRESET_BY_COUNT[nextCount],
        strings: buildStringsForCount(nextCount),
      };
    }

    case "setScale":
      return {
        ...state,
        [action.key]: action.value,
      };

    case "setTuningPreset": {
      if (action.value === "custom") {
        return state;
      }

      const preset = getPresetByKey(state.stringCount, action.value);

      return {
        ...state,
        tuningPreset: preset.key,
        strings: state.strings.map((stringState, index) => ({
          ...stringState,
          midi: noteToMidi(preset.notes[index]),
        })),
      };
    }

    case "setStringField": {
      const strings = state.strings.map((stringState, index) =>
        index === action.index ? { ...stringState, [action.key]: action.value } : stringState,
      );

      const tuningPreset =
        action.key === "midi" ? detectPresetKey(state.stringCount, strings) : state.tuningPreset;

      return {
        ...state,
        strings,
        tuningPreset,
      };
    }

    default:
      return state;
  }
}

function summarySplit(row, stringCount) {
  if (stringCount === 6) {
    return row.index < 3 ? { treble: row.tensionLbs, bass: 0 } : { treble: 0, bass: row.tensionLbs };
  }

  if (stringCount === 7) {
    if (row.index < 3) {
      return { treble: row.tensionLbs, bass: 0 };
    }

    if (row.index === 3) {
      return { treble: row.tensionLbs / 2, bass: row.tensionLbs / 2 };
    }

    return { treble: 0, bass: row.tensionLbs };
  }

  if (stringCount === 8) {
    return row.index < 4 ? { treble: row.tensionLbs, bass: 0 } : { treble: 0, bass: row.tensionLbs };
  }

  if (stringCount === 9) {
    if (row.index < 4) {
      return { treble: row.tensionLbs, bass: 0 };
    }

    if (row.index === 4) {
      return { treble: row.tensionLbs / 2, bass: row.tensionLbs / 2 };
    }

    return { treble: 0, bass: row.tensionLbs };
  }

  return row.index < 4 ? { treble: row.tensionLbs, bass: 0 } : { treble: 0, bass: row.tensionLbs };
}

export default function StringTensionCalculator() {
  const [state, dispatch] = useReducer(reducer, undefined, buildInitialState);

  const scaleTreble = parseOptionalNumber(state.scaleTreble);
  const scaleBass = parseOptionalNumber(state.scaleBass);

  const rows = state.strings.map((stringState, index) => {
    const scaleLength = interpolateScale(index, state.stringCount, scaleTreble, scaleBass);
    const frequency = midiToFrequency(stringState.midi);
    const gaugeThousandths = normalizeGaugeInput(stringState.gaugeInput);
    const { unitWeight, source } = resolveUnitWeight(gaugeThousandths, stringState.type);
    const tensionLbs = calculateTension(unitWeight, scaleLength, frequency);
    const tensionKg = toKg(tensionLbs);

    return {
      index,
      stringNumber: index + 1,
      midi: stringState.midi,
      noteLabel: midiToLabel(stringState.midi),
      frequency,
      gaugeInput: stringState.gaugeInput,
      gaugeThousandths,
      type: stringState.type,
      scaleLength,
      unitWeight,
      unitWeightSource: source,
      tensionLbs,
      tensionKg,
    };
  });

  const totalTension = rows.reduce((sum, row) => sum + row.tensionLbs, 0);
  const maxTension = rows.reduce((max, row) => Math.max(max, row.tensionLbs), 0);
  const meanTension = rows.length ? totalTension / rows.length : 0;
  const summary = rows.reduce(
    (accumulator, row) => {
      const split = summarySplit(row, state.stringCount);
      return {
        treble: accumulator.treble + split.treble,
        bass: accumulator.bass + split.bass,
      };
    },
    { treble: 0, bass: 0 },
  );
  const imbalance = Math.abs(summary.treble - summary.bass);

  return (
    <div className="min-h-screen bg-[#0f0f0f] px-3 py-5 text-[#e5e5e5] sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="space-y-2">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight text-[#14b8a6] sm:text-3xl">String Tension Calculator</h1>
              <p className="max-w-3xl text-sm leading-6 text-[#9ca3af]">
                Multiscale calculation supported, and unit mass weight based on D&apos;Addario&apos;s published data.
              </p>
            </div>
            <div className="w-full rounded-2xl border border-[#2a2a2a] bg-[#171717] px-4 py-3 text-left sm:w-auto sm:text-right">
              <p className="text-xs uppercase tracking-[0.18em] text-[#888]">Total Tension</p>
              <p className="font-mono text-2xl font-semibold text-white">{formatNumber(totalTension)} lbs</p>
              <p className="font-mono text-sm text-[#9ca3af]">{formatNumber(toKg(totalTension))} kg</p>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 rounded-3xl border border-[#2a2a2a] bg-[#171717] p-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-[#888]">String Count</p>
            <div className="flex gap-2">
              {STRING_COUNT_OPTIONS.map((count) => {
                const active = count === state.stringCount;

                return (
                  <button
                    key={count}
                    type="button"
                    onClick={() => dispatch({ type: "setStringCount", value: count })}
                    className={`flex-1 rounded-2xl border px-3 py-3 text-base font-medium transition sm:py-2 sm:text-sm ${
                      active
                        ? "border-[#14b8a6] bg-[#14b8a6]/15 text-[#ccfbf1]"
                        : "border-[#2a2a2a] bg-[#111111] text-[#d4d4d4] hover:border-[#3f3f46]"
                    }`}
                  >
                    {count}
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-[#6b7280]">Changing count resets notes, gauges, and types to the default set.</p>
          </div>

          <label className="space-y-3">
            <span className="block text-xs uppercase tracking-[0.18em] text-[#888]">Treble Scale (in)</span>
            <input
              type="number"
              min="20"
              max="40"
              step="0.01"
              value={state.scaleTreble}
              onChange={(event) => dispatch({ type: "setScale", key: "scaleTreble", value: event.target.value })}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#111111] px-3 py-3 text-base text-white outline-none ring-0 transition focus:border-[#14b8a6] sm:py-2 sm:text-sm"
            />
          </label>

          <label className="space-y-3">
            <span className="block text-xs uppercase tracking-[0.18em] text-[#888]">Bass Scale (in)</span>
            <input
              type="number"
              min="20"
              max="40"
              step="0.01"
              value={state.scaleBass}
              onChange={(event) => dispatch({ type: "setScale", key: "scaleBass", value: event.target.value })}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#111111] px-3 py-3 text-base text-white outline-none ring-0 transition focus:border-[#14b8a6] sm:py-2 sm:text-sm"
            />
          </label>

          <label className="space-y-3">
            <span className="block text-xs uppercase tracking-[0.18em] text-[#888]">Tuning Preset</span>
            <select
              value={state.tuningPreset}
              onChange={(event) => dispatch({ type: "setTuningPreset", value: event.target.value })}
              className="w-full rounded-2xl border border-[#2a2a2a] bg-[#111111] px-3 py-3 text-base text-white outline-none transition focus:border-[#14b8a6] sm:py-2 sm:text-sm"
            >
              {TUNING_PRESETS[state.stringCount].map((preset) => (
                <option key={preset.key} value={preset.key}>
                  {preset.label}
                </option>
              ))}
              {state.tuningPreset === "custom" ? <option value="custom">Custom</option> : null}
            </select>
          </label>
        </section>

        <section className="overflow-hidden rounded-3xl border border-[#2a2a2a] bg-[#171717]">
          <div className="flex flex-col gap-2 border-b border-[#2a2a2a] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Per-string breakdown</h2>
              <p className="text-sm text-[#888]">Unit weight resolves via embedded lookup first, then power-law fallback.</p>
            </div>
            <p className="text-xs text-[#6b7280]">Swipe horizontally on mobile. Rows are highlighted when tension is more than 15% from the set mean.</p>
          </div>

          <div className="-mx-3 overflow-x-auto px-3 sm:mx-0 sm:px-0">
            <table className="min-w-[50rem] divide-y divide-[#2a2a2a] text-left text-sm sm:min-w-full">
              <thead className="bg-[#111111] text-xs uppercase tracking-[0.16em] text-[#888]">
                <tr>
                  <th className="px-3 py-3 sm:px-4">String</th>
                  <th className="px-3 py-3 sm:px-4">Note</th>
                  <th className="px-3 py-3 sm:px-4">Gauge</th>
                  <th className="px-3 py-3 sm:px-4">Type</th>
                  <th className="px-3 py-3 sm:px-4">Scale</th>
                  <th className="px-3 py-3 sm:px-4">Tension</th>
                  <th className="px-3 py-3 sm:px-4">Kg</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {rows.map((row) => {
                  const variance = meanTension ? (row.tensionLbs - meanTension) / meanTension : 0;
                  const toneClass =
                    variance > 0.15
                      ? "bg-amber-500/6"
                      : variance < -0.15
                        ? "bg-slate-400/6"
                        : "bg-transparent";
                  const barWidth = maxTension ? `${(row.tensionLbs / maxTension) * 100}%` : "0%";

                  return (
                    <tr key={row.stringNumber} className={toneClass}>
                      <td className="px-3 py-3 font-mono text-[#d4d4d4] sm:px-4">{row.stringNumber}</td>
                      <td className="px-3 py-3 sm:px-4">
                        <div className="min-w-[6rem] sm:min-w-[7rem]">
                          <select
                            value={row.midi}
                            onChange={(event) =>
                              dispatch({
                                type: "setStringField",
                                index: row.index,
                                key: "midi",
                                value: Number(event.target.value),
                              })
                            }
                            className="w-full rounded-xl border border-[#2a2a2a] bg-[#111111] px-2.5 py-3 text-sm text-white outline-none transition focus:border-[#14b8a6] sm:px-3 sm:py-2"
                          >
                            {NOTE_OPTIONS.map((note) => (
                              <option key={note.midi} value={note.midi}>
                                {note.label}
                              </option>
                            ))}
                          </select>
                          <p className="mt-1 font-mono text-xs text-[#6b7280]">{formatNumber(row.frequency, 2)} Hz</p>
                        </div>
                      </td>
                      <td className="px-3 py-3 sm:px-4">
                        <input
                          type="number"
                          inputMode="decimal"
                          step={gaugeStepForString(row.index)}
                          value={row.gaugeInput}
                          onChange={(event) =>
                            dispatch({
                              type: "setStringField",
                              index: row.index,
                              key: "gaugeInput",
                              value: event.target.value,
                            })
                          }
                          className="w-20 rounded-xl border border-[#2a2a2a] bg-[#111111] px-2.5 py-3 font-mono text-sm text-white outline-none transition focus:border-[#14b8a6] sm:w-24 sm:px-3 sm:py-2"
                        />
                        <p className="mt-1 font-mono text-xs text-[#6b7280]">{formatGaugeDisplay(row.gaugeThousandths)}</p>
                      </td>
                      <td className="px-3 py-3 sm:px-4">
                        <select
                          value={row.type}
                          onChange={(event) =>
                            dispatch({
                              type: "setStringField",
                              index: row.index,
                              key: "type",
                              value: event.target.value,
                            })
                          }
                          className="w-16 rounded-xl border border-[#2a2a2a] bg-[#111111] px-2 py-3 text-sm text-white outline-none transition focus:border-[#14b8a6] sm:w-20 sm:px-3 sm:py-2"
                        >
                          <option value="PL">PL</option>
                          <option value="NW">NW</option>
                        </select>
                      </td>
                      <td className="px-3 py-3 font-mono text-[#d4d4d4] sm:px-4">{formatNumber(row.scaleLength, 2)} in</td>
                      <td className="px-3 py-3 sm:px-4">
                        <div className="min-w-[10rem] w-full space-y-1 sm:min-w-[12rem]">
                          <div className="font-mono text-[#f5f5f5]">{formatNumber(row.tensionLbs)} lbs</div>
                          <div className="h-2 overflow-hidden rounded-full bg-[#262626]">
                            <div className="h-full rounded-full bg-[#14b8a6]" style={{ width: barWidth }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 font-mono text-[#d4d4d4] sm:px-4">{formatNumber(row.tensionKg)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-[#2a2a2a] bg-[#171717] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#888]">Total Tension</p>
            <p className="mt-2 font-mono text-2xl font-semibold text-white">{formatNumber(totalTension)} lbs</p>
            <p className="font-mono text-sm text-[#9ca3af]">{formatNumber(toKg(totalTension))} kg</p>
          </div>

          <div className="rounded-3xl border border-[#2a2a2a] bg-[#171717] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#888]">Treble Side</p>
            <p className="mt-2 font-mono text-2xl font-semibold text-white">{formatNumber(summary.treble)} lbs</p>
            <p className="font-mono text-sm text-[#9ca3af]">{formatNumber(toKg(summary.treble))} kg</p>
          </div>

          <div className="rounded-3xl border border-[#2a2a2a] bg-[#171717] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#888]">Bass Side</p>
            <p className="mt-2 font-mono text-2xl font-semibold text-white">{formatNumber(summary.bass)} lbs</p>
            <p className="font-mono text-sm text-[#9ca3af]">{formatNumber(toKg(summary.bass))} kg</p>
          </div>

          <div className="rounded-3xl border border-[#2a2a2a] bg-[#171717] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#888]">Imbalance</p>
            <p className="mt-2 font-mono text-2xl font-semibold text-white">{formatNumber(imbalance)} lbs</p>
            <p className="font-mono text-sm text-[#9ca3af]">{formatNumber(toKg(imbalance))} kg</p>
          </div>
        </section>
      </div>
    </div>
  );
}
