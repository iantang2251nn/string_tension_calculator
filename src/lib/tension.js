export const STRING_COUNT_OPTIONS = [6, 7, 8, 9];

export const DEFAULT_PRESET_BY_COUNT = {
  6: "standard-6",
  7: "standard-7",
  8: "standard-8",
  9: "standard-9",
};

// `scale` is used when multiscale is off; `scaleTreble`/`scaleBass` when it is on.
export const DEFAULT_SCALE_BY_COUNT = {
  6: { multiscale: false, scale: "25.5", scaleTreble: "24.75", scaleBass: "25.65" },
  7: { multiscale: false, scale: "25.5", scaleTreble: "24.75", scaleBass: "25.65" },
  8: { multiscale: true, scale: "25.5", scaleTreble: "25.5", scaleBass: "27.5" },
  9: { multiscale: false, scale: "25.5", scaleTreble: "25.5", scaleBass: "25.5" },
};

export const NOTE_LABELS = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

export const NOTE_TO_SEMITONE = {
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

export const NOTE_OPTIONS = Array.from({ length: 88 - 23 + 1 }, (_, index) => {
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

export const UNIT_WEIGHT_LOOKUP = {
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

export const TUNING_PRESETS = {
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

export const DEFAULT_GAUGES = {
  6: ["10", "13", "17", "26", "36", "46"],
  7: ["9.5", "12", "16", "24", "34", "44", "56"],
  8: ["9.5", "12", "16", "24", "34", "44", "56", "74"],
  9: ["9", "11", "16", "24", "32", "42", "54", "75", "90"],
};

const PL_COEF = { coef: 0.2217, exp: 2.0002 };
const NW_COEF = { coef: 0.1641, exp: 1.963 };

export function noteToMidi(note) {
  const match = /^([A-G](?:#|b)?)(-?\d+)$/.exec(note);

  if (!match) {
    throw new Error(`Unsupported note: ${note}`);
  }

  const [, name, octaveText] = match;
  const semitone = NOTE_TO_SEMITONE[name];
  const octave = Number(octaveText);

  return (octave + 1) * 12 + semitone;
}

export function midiToLabel(midi) {
  const octave = Math.floor(midi / 12) - 1;
  return `${NOTE_LABELS[midi % 12]}${octave}`;
}

export function midiToFrequency(midi) {
  return 440 * 2 ** ((midi - 69) / 12);
}

export function toKg(lbs) {
  return lbs / 2.20462;
}

export function normalizeGaugeInput(rawValue) {
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

export function gaugeLookupKey(gaugeThousandths) {
  return Number(gaugeThousandths.toFixed(3)).toString();
}

export function formatGaugeDisplay(gaugeThousandths) {
  if (!Number.isFinite(gaugeThousandths)) {
    return "--";
  }

  const decimals = Number.isInteger(gaugeThousandths) ? 3 : 4;
  return (gaugeThousandths / 1000).toFixed(decimals).replace(/^0/, "");
}

export function formatNumber(value, digits = 2) {
  if (!Number.isFinite(value)) {
    return "--";
  }

  return value.toFixed(digits);
}

export function gaugeStepForString(index) {
  return index < 2 ? 0.5 : 1;
}

export function stepGaugeInput(rawValue, direction, index, instrument = GUITAR) {
  const current = normalizeGaugeInput(rawValue);

  if (current === null) {
    return rawValue;
  }

  const next = current + direction * instrument.gaugeStep(index);

  // Values below 1 would be re-read as inches by normalizeGaugeInput.
  return next >= 1 ? String(Number(next.toFixed(3))) : rawValue;
}

export function stepMidi(midi, direction, instrument = GUITAR) {
  const minMidi = instrument.noteOptions[0].midi;
  const maxMidi = instrument.noteOptions[instrument.noteOptions.length - 1].midi;

  return Math.min(maxMidi, Math.max(minMidi, midi + direction));
}

// Shifts every string by a semitone, or leaves the set unchanged if any string would leave the note range.
export function transposeStrings(strings, direction, instrument = GUITAR) {
  const fitsRange = strings.every(
    (stringState) => stepMidi(stringState.midi, direction, instrument) === stringState.midi + direction,
  );

  return fitsRange ? strings.map((stringState) => ({ ...stringState, midi: stringState.midi + direction })) : strings;
}

export function stepAllGauges(strings, direction, instrument = GUITAR) {
  return strings.map((stringState, index) =>
    stringState.gaugeInput === undefined
      ? stringState
      : { ...stringState, gaugeInput: stepGaugeInput(stringState.gaugeInput, direction, index, instrument) },
  );
}

export function parseOptionalNumber(rawValue) {
  if (rawValue.trim() === "") {
    return Number.NaN;
  }

  return Number(rawValue);
}

export function resolveUnitWeight(gaugeThousandths, type) {
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
      ? PL_COEF.coef * gaugeInches ** PL_COEF.exp
      : NW_COEF.coef * gaugeInches ** NW_COEF.exp;

  return { unitWeight, source: "fallback" };
}

export function interpolateScale(index, count, scaleTreble, scaleBass) {
  if (count === 1) {
    return scaleTreble;
  }

  return scaleTreble + ((scaleBass - scaleTreble) * index) / (count - 1);
}

export function calculateTension(unitWeight, scaleLength, frequency) {
  if (!Number.isFinite(unitWeight) || !Number.isFinite(scaleLength) || !Number.isFinite(frequency)) {
    return 0;
  }

  return (unitWeight * (2 * scaleLength * frequency) ** 2) / 386.4;
}

export function getPresetByKey(count, key, instrument = GUITAR) {
  const presets = instrument.tuningPresets[count];
  return presets.find((preset) => preset.key === key) ?? presets[0];
}

export function detectPresetKey(count, strings, instrument = GUITAR) {
  const matchingPreset = instrument.tuningPresets[count].find((preset) =>
    preset.notes.every((note, index) => noteToMidi(note) === strings[index].midi),
  );

  return matchingPreset?.key ?? "custom";
}

// Fields still at the previous count's default follow the new count's default; edited fields are kept.
export function resolveScaleSettingsForCount(current, prevCount, nextCount, instrument = GUITAR) {
  const prevDefaults = instrument.defaultScaleByCount[prevCount];
  const nextDefaults = instrument.defaultScaleByCount[nextCount];

  return Object.fromEntries(
    Object.keys(nextDefaults).map((key) => [
      key,
      current[key] === prevDefaults[key] ? nextDefaults[key] : current[key],
    ]),
  );
}

export function resolveScaleEnds(settings) {
  if (!settings.multiscale) {
    const scale = parseOptionalNumber(settings.scale);
    return { scaleTreble: scale, scaleBass: scale };
  }

  return {
    scaleTreble: parseOptionalNumber(settings.scaleTreble),
    scaleBass: parseOptionalNumber(settings.scaleBass),
  };
}

export function buildStringsForCount(count, instrument = GUITAR) {
  const preset = getPresetByKey(count, instrument.defaultPresetByCount[count], instrument);

  return preset.notes.map((note, index) => ({
    midi: noteToMidi(note),
    gaugeInput: instrument.defaultGauges[count][index],
    type: instrument.defaultType(index),
  }));
}

export function recommendGauge({ referenceTensionLbs, targetScale, targetFrequency, type }) {
  if (
    !Number.isFinite(referenceTensionLbs) ||
    referenceTensionLbs <= 0 ||
    !Number.isFinite(targetScale) ||
    !Number.isFinite(targetFrequency) ||
    targetScale <= 0 ||
    targetFrequency <= 0
  ) {
    return null;
  }

  const lookup = UNIT_WEIGHT_LOOKUP[type];
  const gauges = Object.keys(lookup)
    .map(Number)
    .sort((a, b) => a - b);

  let best = null;
  for (const gauge of gauges) {
    const uw = lookup[gaugeLookupKey(gauge)];
    const tensionLbs = calculateTension(uw, targetScale, targetFrequency);
    const deltaLbs = tensionLbs - referenceTensionLbs;

    if (!best || Math.abs(deltaLbs) < Math.abs(best.deltaLbs)) {
      best = { gauge, unitWeight: uw, tensionLbs, deltaLbs, source: "lookup" };
    }
  }

  const atMin = best.gauge === gauges[0];
  const atMax = best.gauge === gauges[gauges.length - 1];
  const edgeMiss = (atMin || atMax) && Math.abs(best.deltaLbs) > 1;

  if (edgeMiss) {
    const { coef, exp } = type === "PL" ? PL_COEF : NW_COEF;
    const uwIdeal = (referenceTensionLbs * 386.4) / (2 * targetScale * targetFrequency) ** 2;
    const gaugeInches = (uwIdeal / coef) ** (1 / exp);
    const gaugeThousandths = gaugeInches * 1000;
    const tensionLbs = calculateTension(uwIdeal, targetScale, targetFrequency);

    return {
      gauge: gaugeThousandths,
      unitWeight: uwIdeal,
      tensionLbs,
      deltaLbs: tensionLbs - referenceTensionLbs,
      source: "fallback",
      outOfRange: true,
    };
  }

  best.outOfRange = false;
  return best;
}

export const GUITAR = {
  key: "guitar",
  stringCounts: STRING_COUNT_OPTIONS,
  defaultCount: 6,
  tuningPresets: TUNING_PRESETS,
  defaultPresetByCount: DEFAULT_PRESET_BY_COUNT,
  defaultGauges: DEFAULT_GAUGES,
  defaultScaleByCount: DEFAULT_SCALE_BY_COUNT,
  noteOptions: NOTE_OPTIONS,
  defaultType: (index) => (index < 3 ? "PL" : "NW"),
  gaugeStep: gaugeStepForString,
  resolveUnitWeight,
  recommendGauge,
};

// ---- Bass ----

function buildNoteOptions(minMidi, maxMidi) {
  return Array.from({ length: maxMidi - minMidi + 1 }, (_, index) => {
    const midi = minMidi + index;
    return { midi, label: midiToLabel(midi), frequency: midiToFrequency(midi) };
  });
}

// Dingwall long-scale geometry and stock nickel-plated sets (dingwallguitars.com specs/FAQ, dingwallstore.com).
const BASS_DEFAULT_SCALE_BY_COUNT = {
  4: { multiscale: true, scale: "34", scaleTreble: "34", scaleBass: "36.25" },
  5: { multiscale: true, scale: "34", scaleTreble: "34", scaleBass: "37" },
  6: { multiscale: true, scale: "34", scaleTreble: "33.25", scaleBass: "37" },
};

const BASS_DEFAULT_GAUGES = {
  4: ["45", "55", "80", "100"],
  5: ["45", "55", "80", "100", "130"],
  6: ["30", "45", "55", "80", "100", "130"],
};

const BASS_TUNING_PRESETS = {
  4: [{ key: "standard-bass-4", label: "Standard", notes: ["G2", "D2", "A1", "E1"] }],
  5: [{ key: "standard-bass-5", label: "Standard", notes: ["G2", "D2", "A1", "E1", "B0"] }],
  // Presets with `gauges` also load that set: Dingwall nickel long-scale 6-string 30-130 and F# tuning 45-170.
  6: [
    {
      key: "standard-bass-6",
      label: "Standard",
      notes: ["C3", "G2", "D2", "A1", "E1", "B0"],
      gauges: ["30", "45", "55", "80", "100", "130"],
    },
    {
      key: "f-sharp-standard-bass-6",
      label: "F# Standard",
      notes: ["G2", "D2", "A1", "E1", "B0", "F#0"],
      gauges: ["45", "55", "80", "100", "130", "170"],
    },
    {
      key: "drop-e-bass-6",
      label: "Drop E",
      notes: ["G2", "D2", "A1", "E1", "B0", "E0"],
      gauges: ["45", "55", "80", "100", "130", "170"],
    },
  ],
};

// Wound gauges Kalium sells as single bass strings (kaliummusic.com tension calculator data).
const BASS_WOUND_GAUGES = [
  24, 25, 26, 27, 28, 29, 31, 33, 35, 37, 39, 41, 43, 45, 47, 49, 51, 53, 55, 57, 59, 61, 63, 65, 67, 70, 73, 76, 79,
  82, 86, 90, 94, 98, 102, 106, 110, 114, 118, 124, 130, 136, 142, 148, 154, 160, 168, 176, 184, 192, 200, 208, 216,
  226, 236, 246, 256, 266,
];

// Gauges in Dingwall's long/medium-scale sets and D'Addario's XL nickel bass sets (EXL170/165/160/190/220, -5/-6).
const BASS_SET_GAUGES = [30, 32, 40, 45, 50, 55, 58, 60, 65, 70, 75, 80, 85, 95, 98, 100, 105, 127, 130, 135, 170];

const BASS_CANDIDATE_GAUGES = [...new Set([...BASS_WOUND_GAUGES, ...BASS_SET_GAUGES])].sort((a, b) => a - b);

// Blended wound-string unit weight: geometric mean of smooth fits (ln UW = a + b ln g + c ln^2 g, g in inches) to
// Kalium's published unit weights (.021-.266) and D'Addario's (guitar NW table + XL bass values derived from official
// per-string tensions, .017-.135). Above .135 the Kalium curve is used with the brand gap held at its .135 value.
// The two brands sit about +-5% either side of this curve.
const KALIUM_WOUND_FIT = [-1.673859660634048, 2.0486053917919924, 0.02221337000131176];
const DADDARIO_WOUND_FIT = [-2.0831487649316185, 1.8028727869364538, -0.022911543508229507];
const DADDARIO_MAX_GAUGE = 0.135;

function evaluateFit([a, b, c], gaugeInches) {
  const x = Math.log(gaugeInches);
  return Math.exp(a + b * x + c * x * x);
}

export function bassWoundUnitWeight(gaugeInches) {
  const kalium = evaluateFit(KALIUM_WOUND_FIT, gaugeInches);

  if (gaugeInches <= DADDARIO_MAX_GAUGE) {
    return Math.sqrt(kalium * evaluateFit(DADDARIO_WOUND_FIT, gaugeInches));
  }

  const brandRatio = evaluateFit(KALIUM_WOUND_FIT, DADDARIO_MAX_GAUGE) / evaluateFit(DADDARIO_WOUND_FIT, DADDARIO_MAX_GAUGE);
  return kalium / Math.sqrt(brandRatio);
}

export function resolveBassUnitWeight(gaugeThousandths, type) {
  if (!Number.isFinite(gaugeThousandths)) {
    return { unitWeight: 0, source: "invalid" };
  }

  if (type === "PL") {
    return resolveUnitWeight(gaugeThousandths, type);
  }

  return { unitWeight: bassWoundUnitWeight(gaugeThousandths / 1000), source: "estimate" };
}

export function recommendBassGauge({ referenceTensionLbs, targetScale, targetFrequency, type, referenceGauge }) {
  if (type === "PL") {
    return recommendGauge({ referenceTensionLbs, targetScale, targetFrequency, type });
  }

  if (
    !Number.isFinite(referenceTensionLbs) ||
    referenceTensionLbs <= 0 ||
    !Number.isFinite(targetScale) ||
    !Number.isFinite(targetFrequency) ||
    targetScale <= 0 ||
    targetFrequency <= 0
  ) {
    return null;
  }

  // The reference string's own gauge is always a candidate, so an identical setup recommends the same gauge.
  const candidates = Number.isFinite(referenceGauge)
    ? [...new Set([...BASS_CANDIDATE_GAUGES, referenceGauge])].sort((a, b) => a - b)
    : BASS_CANDIDATE_GAUGES;

  let best = null;
  for (const gauge of candidates) {
    const unitWeight = bassWoundUnitWeight(gauge / 1000);
    const tensionLbs = calculateTension(unitWeight, targetScale, targetFrequency);
    const deltaLbs = tensionLbs - referenceTensionLbs;

    if (!best || Math.abs(deltaLbs) < Math.abs(best.deltaLbs)) {
      best = { gauge, unitWeight, tensionLbs, deltaLbs, source: "lookup" };
    }
  }

  const atEdge = best.gauge === candidates[0] || best.gauge === candidates[candidates.length - 1];

  if (atEdge && Math.abs(best.deltaLbs) > 1) {
    // Solve the blended curve for the exact gauge (it increases monotonically with gauge).
    const uwIdeal = (referenceTensionLbs * 386.4) / (2 * targetScale * targetFrequency) ** 2;
    let low = Math.log(0.005);
    let high = Math.log(0.5);
    for (let step = 0; step < 60; step += 1) {
      const mid = (low + high) / 2;
      if (bassWoundUnitWeight(Math.exp(mid)) < uwIdeal) low = mid;
      else high = mid;
    }
    const tensionLbs = calculateTension(uwIdeal, targetScale, targetFrequency);

    return {
      gauge: Math.exp((low + high) / 2) * 1000,
      unitWeight: uwIdeal,
      tensionLbs,
      deltaLbs: tensionLbs - referenceTensionLbs,
      source: "fallback",
      outOfRange: true,
    };
  }

  best.outOfRange = false;
  return best;
}

export const BASS = {
  key: "bass",
  stringCounts: [4, 5, 6],
  defaultCount: 5,
  tuningPresets: BASS_TUNING_PRESETS,
  defaultPresetByCount: { 4: "standard-bass-4", 5: "standard-bass-5", 6: "standard-bass-6" },
  defaultGauges: BASS_DEFAULT_GAUGES,
  defaultScaleByCount: BASS_DEFAULT_SCALE_BY_COUNT,
  noteOptions: buildNoteOptions(12, 72),
  defaultType: () => "NW",
  gaugeStep: () => 1,
  resolveUnitWeight: resolveBassUnitWeight,
  recommendGauge: recommendBassGauge,
};

export const INSTRUMENTS = { guitar: GUITAR, bass: BASS };
