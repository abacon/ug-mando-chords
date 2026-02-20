(function () {
  var M = window.MandolinChords;

  M["Gb7"] = [
    { frets: [3,4,4,0], fingers: [1,2,2,0], baseFret: 1, barres: [4] },
    { frets: [2,1,3,1], fingers: [3,1,4,2], baseFret: 2, barres: [] },
    { frets: [3,1,4,3], fingers: [2,1,4,3], baseFret: 4, barres: [] },
  ];

  M["Gb"] = [
    { frets: [2,3,3,1], fingers: [2,3,3,1], baseFret: 2, barres: [3] },
    { frets: [3,1,1,3], fingers: [2,1,1,3], baseFret: 4, barres: [1] },
    { frets: [1,2,2,4], fingers: [1,2,2,3], baseFret: 3, barres: [2] },
  ];

  M["Gbm"] = [
    { frets: [1,3,3,1], fingers: [1,3,3,2], baseFret: 2, barres: [3] },
    { frets: [1,3,3,4], fingers: [1,2,2,3], baseFret: 2, barres: [3] },
    { frets: [3,1,1,2], fingers: [3,1,1,2], baseFret: 4, barres: [1] },
  ];

  M["Gbmaj7"] = [
    { frets: [2,2,3,1], fingers: [2,2,3,1], baseFret: 2, barres: [2] },
    { frets: [3,4,4,1], fingers: [2,3,3,1], baseFret: 1, barres: [4] },
    { frets: [3,1,5,3], fingers: [2,1,4,3], baseFret: 4, barres: [] },
  ];

  M["Gbm7"] = [
    { frets: [2,4,4,0], fingers: [1,2,2,0], baseFret: 1, barres: [4] },
    { frets: [1,1,3,1], fingers: [1,1,2,1], baseFret: 2, barres: [1] },
    { frets: [3,1,4,2], fingers: [3,1,4,2], baseFret: 4, barres: [] },
  ];

  M["Gbdim"] = [
    { frets: [5,4,0,5], fingers: [2,1,0,3], baseFret: 1, barres: [] },
    { frets: [1,3,2,1], fingers: [1,4,3,2], baseFret: 2, barres: [] },
    { frets: [5,4,0,2], fingers: [3,2,0,1], baseFret: 1, barres: [] },
  ];

  M["Gbaug"] = [
    { frets: [3,0,1,2], fingers: [3,0,1,2], baseFret: 1, barres: [] },
    { frets: [3,0,5,2], fingers: [2,0,3,1], baseFret: 1, barres: [] },
    { frets: [2,3,4,1], fingers: [2,3,4,1], baseFret: 2, barres: [] },
  ];

  M["Gbsus2"] = [
    { frets: [1,4,4,2], fingers: [1,3,3,2], baseFret: 1, barres: [4] },
    { frets: [1,4,4,4], fingers: [1,2,2,2], baseFret: 1, barres: [4] },
    { frets: [3,1,1,1], fingers: [2,1,1,1], baseFret: 4, barres: [1] },
  ];

  M["Gbsus4"] = [
    { frets: [3,3,3,1], fingers: [2,2,2,1], baseFret: 2, barres: [3] },
    { frets: [5,3,1,1], fingers: [3,2,1,1], baseFret: 2, barres: [1] },
    { frets: [1,1,1,4], fingers: [1,1,1,2], baseFret: 4, barres: [1] },
  ];

  M["F#7"] = M["Gb7"];
  M["F#"] = M["Gb"];
  M["F#m"] = M["Gbm"];
  M["F#maj7"] = M["Gbmaj7"];
  M["F#m7"] = M["Gbm7"];
  M["F#dim"] = M["Gbdim"];
  M["F#aug"] = M["Gbaug"];
  M["F#sus2"] = M["Gbsus2"];
  M["F#sus4"] = M["Gbsus4"];

})();
