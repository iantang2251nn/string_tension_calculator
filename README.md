# String Tension Calculator

A single-page web app for computing per-string and aggregate tension on 6/7/8/9-string electric guitars, with native multi-scale (fanned-fret) support. Built with React 19, Vite, and Tailwind CSS v4.

Unit-weight values are based on D'Addario's published data (lookup table for tabulated gauges, power-law fallback for everything else).

## Modes

### Calculator

Per-string tension breakdown with treble/bass/total/imbalance summary. Pick string count, multiscale lengths, tuning preset (or per-string notes), and gauge + PL/NW type for each string. The table shows interpolated scale length, tension in lbs/kg, and a relative tension bar; rows tinted when a string is more than 10% from the set mean.

### Tension Translation Guide

Translate the feel of one guitar to another. Enter the **reference** guitar (count, scales, tunings, gauges, types) and the **target** guitar (scales, tunings, types — gauges are recommended). For each target string the app picks the gauge whose tension comes closest to the reference's tension. Recommendations prefer tabulated D'Addario gauges; the algorithm falls back to a continuous power-law estimate only when the desired tension sits outside the tabulated range.

## Formula

```
T (lbs) = UW × (2 × L × F)² / 386.4
```

where `UW` is unit weight (lb/in), `L` is scale length (in), and `F` is pitch frequency (Hz, 12-TET, A4 = 440 Hz).

## Develop

```
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

## Deploy

GitHub Actions deploys `dist/` to GitHub Pages on push to `main` (`.github/workflows/deploy-pages.yml`).

## Files

- `StringTensionCalculator.jsx` — Calculator mode
- `TensionTranslator.jsx` — Translation Guide mode
- `src/lib/tension.js` — shared formulas, lookup tables, presets, and `recommendGauge`
- `src/App.jsx` — mode switch
- `DESIGN.md` — original design document
- `daddario_unit_weights_final.csv` — source data (the runtime lookup is hardcoded in `tension.js`)
