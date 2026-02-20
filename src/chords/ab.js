(function () {
  var M = window.MandolinChords;

  M["Ab7"] = [
    { frets: [1,1,3,2], fingers: [1,1,3,2], baseFret: 1, barres: [1] },
    { frets: [2,1,3,1], fingers: [3,1,4,2], baseFret: 4, barres: [] },
    { frets: [4,5,5,1], fingers: [2,3,3,1], baseFret: 2, barres: [5] },
  ];

  M["Ab"] = [
    { frets: [1,1,3,4], fingers: [1,1,2,3], baseFret: 1, barres: [1] },
    { frets: [5,1,3,4], fingers: [4,1,2,3], baseFret: 1, barres: [] },
    { frets: [2,3,3,1], fingers: [2,3,3,1], baseFret: 4, barres: [3] },
  ];

  M["Abm"] = [
    { frets: [1,1,2,4], fingers: [1,1,2,3], baseFret: 1, barres: [1] },
    { frets: [4,1,2,4], fingers: [3,1,2,4], baseFret: 1, barres: [] },
    { frets: [1,3,3,1], fingers: [1,3,3,2], baseFret: 4, barres: [3] },
  ];

  M["Abmaj7"] = [
    { frets: [1,1,3,3], fingers: [1,1,2,2], baseFret: 1, barres: [1,3] },
    { frets: [0,1,3,4], fingers: [0,1,2,3], baseFret: 1, barres: [] },
    { frets: [2,2,3,1], fingers: [2,2,3,1], baseFret: 4, barres: [2] },
  ];

  M["Abm7"] = [
    { frets: [1,1,2,2], fingers: [1,1,2,2], baseFret: 1, barres: [1,2] },
    { frets: [1,1,3,1], fingers: [1,1,2,1], baseFret: 4, barres: [1] },
    { frets: [3,5,5,1], fingers: [2,3,3,1], baseFret: 2, barres: [5] },
  ];

  M["Abdim"] = [
    { frets: [1,0,2,4], fingers: [1,0,2,3], baseFret: 1, barres: [] },
    { frets: [4,0,2,4], fingers: [2,0,1,3], baseFret: 1, barres: [] },
    { frets: [4,0,5,4], fingers: [1,0,3,2], baseFret: 1, barres: [] },
  ];

  M["Abaug"] = [
    { frets: [1,2,3,0], fingers: [1,2,3,0], baseFret: 1, barres: [] },
    { frets: [1,2,3,4], fingers: [1,2,3,4], baseFret: 1, barres: [] },
    { frets: [4,1,2,3], fingers: [4,1,2,3], baseFret: 2, barres: [] },
  ];

  M["Absus2"] = [
    { frets: [1,1,1,4], fingers: [1,1,1,2], baseFret: 1, barres: [1] },
    { frets: [3,1,1,4], fingers: [2,1,1,3], baseFret: 1, barres: [1] },
    { frets: [1,4,4,2], fingers: [1,3,3,2], baseFret: 3, barres: [4] },
  ];

  M["Absus4"] = [
    { frets: [1,1,4,4], fingers: [1,1,2,2], baseFret: 1, barres: [1,4] },
    { frets: [3,3,3,1], fingers: [2,2,2,1], baseFret: 4, barres: [3] },
    { frets: [5,3,1,1], fingers: [3,2,1,1], baseFret: 4, barres: [1] },
  ];

  M["G#7"] = M["Ab7"];
  M["G#"] = M["Ab"];
  M["G#m"] = M["Abm"];
  M["G#maj7"] = M["Abmaj7"];
  M["G#m7"] = M["Abm7"];
  M["G#dim"] = M["Abdim"];
  M["G#aug"] = M["Abaug"];
  M["G#sus2"] = M["Absus2"];
  M["G#sus4"] = M["Absus4"];

})();
