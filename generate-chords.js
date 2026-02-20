#!/usr/bin/env node
// One-time generator for mandolin chord data files.
// Run: node generate-chords.js
// Outputs: src/chord-data.js + src/chords/{root}.js

const fs = require("fs");
const path = require("path");

const TUNING = [55, 62, 69, 76]; // G3, D4, A4, E5 MIDI
const MAX_FRET = 12;
const MAX_SPAN = 4;
const VOICINGS_PER_CHORD = 3;

const NOTE_NAMES = [
  "C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B",
];

const ENHARMONICS = {
  Db: "C#", Eb: "D#", Gb: "F#", Ab: "G#", Bb: "A#",
};

const SUFFIXES = {
  "":     [0, 4, 7],
  m:      [0, 3, 7],
  "7":    [0, 4, 7, 10],
  maj7:   [0, 4, 7, 11],
  m7:     [0, 3, 7, 10],
  dim:    [0, 3, 6],
  aug:    [0, 4, 8],
  sus2:   [0, 2, 7],
  sus4:   [0, 5, 7],
};

function chordPitchClasses(rootIndex, intervals) {
  return intervals.map((i) => (rootIndex + i) % 12);
}

function findVoicings(rootIndex, intervals) {
  const targets = chordPitchClasses(rootIndex, intervals);
  const rootPC = targets[0];

  // For each string, which frets produce a target note?
  const options = TUNING.map((open) => {
    const valid = [];
    for (let f = 0; f <= MAX_FRET; f++) {
      if (targets.includes((open + f) % 12)) valid.push(f);
    }
    return valid;
  });

  const candidates = [];
  for (const g of options[0]) {
    for (const d of options[1]) {
      for (const a of options[2]) {
        for (const e of options[3]) {
          const frets = [g, d, a, e];
          const nonZero = frets.filter((f) => f > 0);
          if (nonZero.length === 0) continue;
          const lo = Math.min(...nonZero);
          const hi = Math.max(...nonZero);
          if (hi - lo > MAX_SPAN) continue;

          const hasOpen = frets.some((f) => f === 0);
          // Open-string voicings must fit in a 5-fret diagram from the nut
          if (hasOpen && hi > 5) continue;

          const pcs = frets.map((f, i) => (TUNING[i] + f) % 12);
          const pcsSet = new Set(pcs);
          const targetHits = new Set(targets.filter((t) => pcsSet.has(t)));
          // Every chord tone must be present (doubled notes are fine)
          if (targetHits.size < targets.length) continue;

          let score = 0;
          score -= lo * 2;
          score -= (hi - lo) * 3;
          if (pcs[0] === rootPC) score += 5; // root in bass
          score += pcsSet.size * 4;
          if (hasOpen) score += 3; // prefer open voicings
          if (lo > 7) score -= 8;

          candidates.push({ frets, score });
        }
      }
    }
  }

  candidates.sort((a, b) => b.score - a.score);

  const selected = [];
  for (const c of candidates) {
    if (selected.length >= VOICINGS_PER_CHORD) break;
    // Skip near-duplicates
    if (
      selected.some(
        (s) =>
          s.frets.reduce((sum, f, i) => sum + Math.abs(f - c.frets[i]), 0) <= 1
      )
    )
      continue;
    selected.push(c);
  }

  return selected.map((s) => formatVoicing(s.frets));
}

function formatVoicing(absFrets) {
  const nonZero = absFrets.filter((f) => f > 0);
  const hasOpen = absFrets.some((f) => f === 0);
  // Show from the nut when there are open strings
  const baseFret = hasOpen ? 1 : nonZero.length ? Math.min(...nonZero) : 1;

  const frets = absFrets.map((f) => (f <= 0 ? f : f - baseFret + 1));

  // Detect barres: same relative fret on 2+ adjacent strings
  const fretPositions = {};
  frets.forEach((f, i) => {
    if (f > 0) (fretPositions[f] = fretPositions[f] || []).push(i);
  });
  const barres = [];
  for (const [fret, strings] of Object.entries(fretPositions)) {
    if (strings.length >= 2) {
      // Check adjacency
      for (let i = 0; i < strings.length - 1; i++) {
        if (strings[i + 1] - strings[i] === 1) {
          barres.push(parseInt(fret));
          break;
        }
      }
    }
  }

  // Assign fingers
  const fingers = [0, 0, 0, 0];
  const positions = [];
  frets.forEach((f, i) => {
    if (f > 0) positions.push({ fret: f, string: i });
  });
  positions.sort((a, b) => a.fret - b.fret || a.string - b.string);

  let nextFinger = 1;
  const fretFinger = {};
  for (const pos of positions) {
    if (barres.includes(pos.fret) && !fretFinger[pos.fret]) {
      fretFinger[pos.fret] = nextFinger++;
    }
    if (fretFinger[pos.fret]) {
      fingers[pos.string] = fretFinger[pos.fret];
    } else {
      fingers[pos.string] = Math.min(nextFinger++, 4);
    }
  }

  return { frets, fingers, baseFret, barres };
}

function voicingToJS(v, indent) {
  return (
    `${indent}{ frets: [${v.frets}], fingers: [${v.fingers}], ` +
    `baseFret: ${v.baseFret}, barres: [${v.barres}] }`
  );
}

// --- Generate files ---

const outDir = path.join(__dirname, "src", "chords");
fs.mkdirSync(outDir, { recursive: true });

// Main chord-data.js
const mainFile = `window.MandolinChords = {};\n`;
fs.writeFileSync(path.join(__dirname, "src", "chord-data.js"), mainFile);

const fileList = [];

for (const root of NOTE_NAMES) {
  const rootIndex = NOTE_NAMES.indexOf(root);
  const filename = root.toLowerCase().replace("#", "s") + ".js";
  fileList.push(filename);

  let code = "(function () {\n  var M = window.MandolinChords;\n\n";

  for (const [suffix, intervals] of Object.entries(SUFFIXES)) {
    const chordName = root + suffix;
    const voicings = findVoicings(rootIndex, intervals);
    if (voicings.length === 0) continue;

    code += `  M["${chordName}"] = [\n`;
    code += voicings.map((v) => voicingToJS(v, "    ")).join(",\n");
    code += ",\n  ];\n\n";
  }

  // Enharmonic alias
  if (ENHARMONICS[root]) {
    const alias = ENHARMONICS[root];
    for (const suffix of Object.keys(SUFFIXES)) {
      const orig = root + suffix;
      const alt = alias + suffix;
      code += `  M["${alt}"] = M["${orig}"];\n`;
    }
    code += "\n";
  }

  code += "})();\n";

  fs.writeFileSync(path.join(outDir, filename), code);
  console.log(`wrote src/chords/${filename}`);
}

// Print manifest snippet
console.log("\nManifest js array:");
console.log(JSON.stringify(
  [
    "src/chord-data.js",
    ...fileList.map((f) => `src/chords/${f}`),
    "src/chord-renderer.js",
    "src/content.js",
  ],
  null,
  2
));
