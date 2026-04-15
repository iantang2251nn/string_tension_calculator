# String Tension Calculator — Design Document

## Overview

A single-page interactive calculator that computes per-string and aggregate tension for 6-, 7-, and 8-string electric guitars, with native multi-scale (fanned fret) support.

---

## Core Formula

```
T (lbs) = UW × (2 × L × F)² / 386.4
```

| Symbol | Unit | Description |
|--------|------|-------------|
| T | lbs | Tension |
| UW | lb/in | Unit weight (from lookup table or power-law fallback) |
| L | inches | Per-string scale length |
| F | Hz | Target pitch frequency |

### Unit Weight Resolution

1. **Lookup**: match gauge + string type (PL/NW) against `daddario_unit_weights_final.csv` (51 exact D'Addario values).
2. **Fallback** (gauge not in table):
   - Plain steel: `UW = 0.2217 × gauge^2.0002`
   - Nickel wound: `UW = 0.1641 × gauge^1.9630`

Plain steel is used for unwound strings (typically strings 1–3 on a 6-string, 1–3 on a 7/8-string). Nickel wound is used for all wound strings. The string type is inferred from gauge + position but can be overridden manually (e.g., wound 3rd).

---

## Feature Specifications

### F1 — String Count Selector

- Toggle: **6 / 7 / 8**
- Changing the count resets tuning to the default preset for that count (see F3).
- All downstream UI (gauge inputs, tuning selectors, tension table rows) updates to match.

### F2 — Multi-Scale Input

Two numeric inputs:

| Field | Label | Default |
|-------|-------|---------|
| `scale_treble` | Treble scale length (in) | 25.5 |
| `scale_bass` | Bass scale length (in) | 25.5 |

When both values are equal, the guitar is straight-scale. When they differ, per-string scale lengths are **linearly interpolated**:

```
L_i = scale_treble + (scale_bass - scale_treble) × i / (N - 1)
```

where `i = 0` is string 1 (highest pitch) and `i = N-1` is string N (lowest pitch).

The interpolated scale length for each string is displayed in the tension table (read-only, derived).

**Presets** (optional convenience, not required for MVP):

| Label | Treble | Bass |
|-------|--------|------|
| Straight 25.5″ | 25.5 | 25.5 |
| Straight 24.75″ | 24.75 | 24.75 |
| Strandberg 25.5–26.5″ | 25.5 | 26.5 |
| Dingwall 25.5–28″ | 25.5 | 28.0 |

### F3 — Tuning Selector

Each string gets a **scrollable note picker** (dropdown or scroll wheel) ranging from B0 (30.87 Hz) to E6 (1318.5 Hz), covering all practical guitar pitches.

Notes use 12-TET concert pitch (A4 = 440 Hz). Frequency for any note:

```
F = 440 × 2^((midi - 69) / 12)
```

where `midi` is the MIDI note number (e.g., E2 = 40, A2 = 45, E4 = 64).

**Default tuning presets by string count:**

| Strings | Default | Notes (high → low) |
|---------|---------|---------------------|
| 6 | Standard | E4 B3 G3 D3 A2 E2 |
| 7 | Standard | E4 B3 G3 D3 A2 E2 B1 |
| 8 | Standard | E4 B3 G3 D3 A2 E2 B1 F#1 |

**Additional presets** (selectable via a tuning preset dropdown):

| Label | Notes (high → low) |
|-------|---------------------|
| Drop D | E4 B3 G3 D3 A2 D2 |
| D Standard | D4 A3 F3 C3 G2 D2 |
| Drop C | D4 A3 F3 C3 G2 C2 |
| C Standard | C4 G3 Eb3 Bb2 F2 C2 |
| Eb Standard | Eb4 Bb3 Gb3 Db3 Ab2 Eb2 |
| Drop A (7) | E4 B3 G3 D3 A2 E2 A1 |
| Drop G# (7) | E4 B3 G3 D3 A2 E2 G#1 |
| Drop E (8) | E4 B3 G3 D3 A2 E2 B1 E1 |
| F Standard (8) | Eb4 Bb3 Gb3 Db3 Ab2 Eb2 Bb1 F1 |

Presets populate the per-string note selectors; the user can then modify individual strings freely.

### F4 — Gauge Input

Each string gets a numeric input for gauge (in thousandths of an inch, e.g., `10` means .010″).

**Default gauges by string count:**

| Strings | Gauges (high → low) |
|---------|---------------------|
| 6 | 10 13 17 26 36 46 |
| 7 | 10 13 17 26 36 46 59 |
| 8 | 10 13 17 26 36 46 59 74 |

Each string also has a **string type toggle**: PL (plain steel) / NW (nickel wound). Default assignment:

- Strings 1–3: PL
- Strings 4–N: NW

The user can override this (e.g., wound 3rd: set string 3 to NW).

### F5 — Tension Output Table

A table with one row per string, columns:

| Column | Description |
|--------|-------------|
| String # | 1 through N |
| Note | Selected pitch (e.g., E4) |
| Gauge | e.g., .010 |
| Type | PL or NW |
| Scale Length | Interpolated value (in), read-only |
| UW | Unit weight used (lb/in) |
| Tension (lbs) | Computed |
| Tension (kg) | Computed (lbs ÷ 2.20462) |

All tension values update reactively on any input change.

### F6 — Aggregate Tension Summary

Displayed below (or pinned above) the per-string table:

```
Total Tension:        ______ lbs  /  ______ kg

Treble Side:          ______ lbs  /  ______ kg
Bass Side:            ______ lbs  /  ______ kg
Imbalance (Δ):        ______ lbs  /  ______ kg
```

**Treble/bass division rule:**

| Strings | Treble side | Bass side |
|---------|-------------|-----------|
| 6 | Strings 1–3 | Strings 4–6 |
| 7 | Strings 1–3 + ½ × String 4 | ½ × String 4 + Strings 5–7 |
| 8 | Strings 1–4 | Strings 5–8 |

The **imbalance** (Δ) is `|treble − bass|`, useful for assessing neck twist risk on multi-scale instruments.

---

## Data Model

```
State {
  string_count:    6 | 7 | 8
  scale_treble:    number (inches)
  scale_bass:      number (inches)
  strings: [
    {
      note:        string    // e.g. "E4"
      midi:        int       // MIDI note number
      freq:        float     // Hz, derived from midi
      gauge:       float     // thousandths of inch
      type:        "PL" | "NW"
      scale:       float     // interpolated, derived
      uw:          float     // looked up or computed, derived
      tension_lbs: float     // derived
      tension_kg:  float     // derived
    }
  ]
  total_tension:   float     // derived
  treble_tension:  float     // derived
  bass_tension:    float     // derived
}
```

All `derived` fields recompute reactively when any input changes.

---

## Visual Design

Modern, minimalist UI with a **dark background** throughout.

- **Color palette**: dark neutral base (e.g., `#0f0f0f` / `#1a1a1a` backgrounds), subtle border separators (`#2a2a2a`), white/light gray primary text (`#e5e5e5`), muted secondary text (`#888`). One accent color for interactive elements and tension bars (e.g., cool blue `#3b82f6` or teal `#14b8a6`).
- **Typography**: clean sans-serif (system font stack). Monospaced for numeric readouts (gauges, tensions, scale lengths) to maintain column alignment.
- **Density**: compact but not cramped. The tension table is the centerpiece — give it room. Controls (string count, scale lengths, tuning preset) sit above in a slim config bar.
- **Depth**: minimal use of shadows or elevation. Rely on subtle background shade differences to separate sections (config area vs. table vs. summary).
- **No visual clutter**: no gradients, no decorative borders, no icons unless functionally necessary. Let the numbers breathe.

## UX Notes

- **Scrollable tuning selector**: each string's note picker should support touch-friendly scroll/swipe, not just a flat dropdown. Think iOS-style scroll wheel or a tall dropdown with momentum scrolling. Notes displayed as `NoteOctave` (e.g., `E2`, `Bb3`).
- **Gauge input**: numeric stepper or free-text. Accept integer (e.g., `10`) or decimal (e.g., `.010`); normalize internally to decimal inches.
- **Instant feedback**: no "calculate" button. All outputs update on every keystroke / selection change.
- **Visual tension bar**: optional — a horizontal bar per string, scaled relative to the max tension in the set, giving a quick visual read on balance. Use the accent color against the dark background for high contrast.
- **Color coding**: highlight strings with tension >15% above or below the set mean — e.g., amber for high, blue-gray for low — as a quick balance diagnostic against the dark background.

---

## Implementation Constraints

- Single-file React artifact (.jsx), all data embedded.
- UW lookup table embedded as a JS object; power-law fallback as inline functions.
- No external API calls. No localStorage.
- All state in React `useState` / `useReducer`.
- Tailwind utility classes only (no custom CSS compilation).

---

## Scope Boundaries

**In scope (MVP):**
- Features F1–F6 as described above
- D'Addario NW + PL unit weights (lookup + power law)
- 12-TET tuning only

**Out of scope:**
- Other string materials (stainless steel, half-round, flatwound, phosphor bronze, nylon)
- Non-standard temperaments
- Acoustic / classical / bass guitar presets
- String break angle or downforce calculations
- Export / save / share functionality
