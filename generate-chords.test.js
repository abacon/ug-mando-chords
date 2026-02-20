#!/usr/bin/env node
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const TUNING = [55, 62, 69, 76]; // G3 D4 A4 E5
const NOTES = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const SUFFIXES = {
  "": [0, 4, 7],
  m: [0, 3, 7],
  "7": [0, 4, 7, 10],
  maj7: [0, 4, 7, 11],
  m7: [0, 3, 7, 10],
  dim: [0, 3, 6],
  aug: [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
};
const ENHARMONICS = { Db: "C#", Eb: "D#", Gb: "F#", Ab: "G#", Bb: "A#" };

// Load all generated chord files into a mock window
const window = { MandolinChords: {} };
global.window = window;

const dataFile = path.join(__dirname, "src", "chord-data.js");
eval(fs.readFileSync(dataFile, "utf8"));

const chordsDir = path.join(__dirname, "src", "chords");
for (const f of fs.readdirSync(chordsDir).sort()) {
  if (f.endsWith(".js")) eval(fs.readFileSync(path.join(chordsDir, f), "utf8"));
}

const M = window.MandolinChords;

function absFretsFrom(voicing) {
  return voicing.frets.map((f) =>
    f <= 0 ? f : f + voicing.baseFret - 1
  );
}

function pitchClasses(voicing) {
  return absFretsFrom(voicing).map((f, i) =>
    f < 0 ? -1 : (TUNING[i] + f) % 12
  );
}

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
  } catch (e) {
    failed++;
    console.error(`FAIL: ${name}`);
    console.error(`  ${e.message}`);
  }
}

// --- Tests ---

test("all 12 roots × 9 suffixes present", () => {
  for (const root of NOTES) {
    for (const suffix of Object.keys(SUFFIXES)) {
      const name = root + suffix;
      assert.ok(M[name], `missing chord: ${name}`);
    }
  }
});

test("108 unique chord entries", () => {
  const unique = new Set();
  for (const root of NOTES) {
    for (const suffix of Object.keys(SUFFIXES)) unique.add(root + suffix);
  }
  assert.strictEqual(unique.size, 108);
});

test("every chord has 3 voicings", () => {
  for (const root of NOTES) {
    for (const suffix of Object.keys(SUFFIXES)) {
      const name = root + suffix;
      assert.strictEqual(M[name].length, 3, `${name} has ${M[name].length} voicings`);
    }
  }
});

test("every voicing contains all required pitch classes", () => {
  for (const root of NOTES) {
    const rootIdx = NOTES.indexOf(root);
    for (const [suffix, intervals] of Object.entries(SUFFIXES)) {
      const name = root + suffix;
      const targets = intervals.map((i) => (rootIdx + i) % 12);
      for (let vi = 0; vi < M[name].length; vi++) {
        const pcs = new Set(pitchClasses(M[name][vi]).filter((p) => p >= 0));
        for (const t of targets) {
          assert.ok(pcs.has(t), `${name} v${vi + 1}: missing ${NOTES[t]}`);
        }
      }
    }
  }
});

test("frets fit within 5-fret diagram window", () => {
  for (const [name, voicings] of Object.entries(M)) {
    if (Array.isArray(voicings)) {
      for (let vi = 0; vi < voicings.length; vi++) {
        const maxRel = Math.max(...voicings[vi].frets.filter((f) => f > 0));
        assert.ok(maxRel <= 5, `${name} v${vi + 1}: relative fret ${maxRel} > 5`);
      }
    }
  }
});

test("open-string voicings use baseFret 1", () => {
  for (const [name, voicings] of Object.entries(M)) {
    if (!Array.isArray(voicings)) continue;
    for (let vi = 0; vi < voicings.length; vi++) {
      const v = voicings[vi];
      if (v.frets.includes(0)) {
        assert.strictEqual(
          v.baseFret, 1,
          `${name} v${vi + 1}: has open string but baseFret=${v.baseFret}`
        );
      }
    }
  }
});

test("baseFret is a positive integer", () => {
  for (const [name, voicings] of Object.entries(M)) {
    if (!Array.isArray(voicings)) continue;
    for (const v of voicings) {
      assert.ok(Number.isInteger(v.baseFret) && v.baseFret >= 1,
        `${name}: baseFret=${v.baseFret}`);
    }
  }
});

test("absolute frets are within 0-12", () => {
  for (const [name, voicings] of Object.entries(M)) {
    if (!Array.isArray(voicings)) continue;
    for (let vi = 0; vi < voicings.length; vi++) {
      for (const f of absFretsFrom(voicings[vi])) {
        assert.ok(f >= 0 && f <= 12, `${name} v${vi + 1}: abs fret ${f} out of range`);
      }
    }
  }
});

test("fretted-note span is at most 4 frets", () => {
  for (const [name, voicings] of Object.entries(M)) {
    if (!Array.isArray(voicings)) continue;
    for (let vi = 0; vi < voicings.length; vi++) {
      const nonZero = absFretsFrom(voicings[vi]).filter((f) => f > 0);
      if (nonZero.length < 2) continue;
      const span = Math.max(...nonZero) - Math.min(...nonZero);
      assert.ok(span <= 4, `${name} v${vi + 1}: span=${span}`);
    }
  }
});

test("fingers array has 4 elements with values 0-4", () => {
  for (const [name, voicings] of Object.entries(M)) {
    if (!Array.isArray(voicings)) continue;
    for (let vi = 0; vi < voicings.length; vi++) {
      const v = voicings[vi];
      assert.strictEqual(v.fingers.length, 4, `${name} v${vi + 1}: fingers length`);
      for (const f of v.fingers) {
        assert.ok(f >= 0 && f <= 4, `${name} v${vi + 1}: finger ${f} out of range`);
      }
    }
  }
});

test("open strings have finger 0", () => {
  for (const [name, voicings] of Object.entries(M)) {
    if (!Array.isArray(voicings)) continue;
    for (let vi = 0; vi < voicings.length; vi++) {
      const v = voicings[vi];
      for (let s = 0; s < 4; s++) {
        if (v.frets[s] === 0) {
          assert.strictEqual(v.fingers[s], 0,
            `${name} v${vi + 1}: string ${s} is open but finger=${v.fingers[s]}`);
        }
      }
    }
  }
});

test("barres reference fret positions that appear on 2+ strings", () => {
  for (const [name, voicings] of Object.entries(M)) {
    if (!Array.isArray(voicings)) continue;
    for (let vi = 0; vi < voicings.length; vi++) {
      const v = voicings[vi];
      for (const b of v.barres) {
        const count = v.frets.filter((f) => f === b).length;
        assert.ok(count >= 2,
          `${name} v${vi + 1}: barre at fret ${b} only on ${count} string(s)`);
      }
    }
  }
});

test("enharmonic aliases share the same voicing arrays", () => {
  for (const [flat, sharp] of Object.entries(ENHARMONICS)) {
    for (const suffix of Object.keys(SUFFIXES)) {
      assert.strictEqual(M[flat + suffix], M[sharp + suffix],
        `${flat + suffix} !== ${sharp + suffix}`);
    }
  }
});

test("no duplicate voicings within a chord", () => {
  for (const [name, voicings] of Object.entries(M)) {
    if (!Array.isArray(voicings)) continue;
    const seen = new Set();
    for (let vi = 0; vi < voicings.length; vi++) {
      const key = JSON.stringify(voicings[vi].frets) + "@" + voicings[vi].baseFret;
      assert.ok(!seen.has(key), `${name} v${vi + 1}: duplicate voicing`);
      seen.add(key);
    }
  }
});

test("known voicings: standard open chords are present", () => {
  // C major: [0,2,3,0] at nut
  const cVoicings = M["C"].map((v) => JSON.stringify(absFretsFrom(v)));
  assert.ok(cVoicings.includes("[0,2,3,0]"), "C missing [0,2,3,0]");

  // G major: [0,0,2,3]
  const gVoicings = M["G"].map((v) => JSON.stringify(absFretsFrom(v)));
  assert.ok(gVoicings.includes("[0,0,2,3]"), "G missing [0,0,2,3]");

  // D major: [2,0,0,2]
  const dVoicings = M["D"].map((v) => JSON.stringify(absFretsFrom(v)));
  assert.ok(dVoicings.includes("[2,0,0,2]"), "D missing [2,0,0,2]");

  // Am: [2,2,3,0]
  const amVoicings = M["Am"].map((v) => JSON.stringify(absFretsFrom(v)));
  assert.ok(amVoicings.includes("[2,2,3,0]"), "Am missing [2,2,3,0]");

  // Dm: [2,0,0,1]
  const dmVoicings = M["Dm"].map((v) => JSON.stringify(absFretsFrom(v)));
  assert.ok(dmVoicings.includes("[2,0,0,1]"), "Dm missing [2,0,0,1]");

  // Em: [0,2,2,0]
  const emVoicings = M["Em"].map((v) => JSON.stringify(absFretsFrom(v)));
  assert.ok(emVoicings.includes("[0,2,2,0]"), "Em missing [0,2,2,0]");
});

// --- Summary ---

console.log(`\n${passed + failed} tests, ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
