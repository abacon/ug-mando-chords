(function () {
  var M = window.MandolinChords;

  M["Bb7"] = [
    { frets: [1,0,1,1], fingers: [1,0,1,1], baseFret: 1, barres: [1] },
    { frets: [1,1,3,2], fingers: [1,1,3,2], baseFret: 3, barres: [1] },
    { frets: [2,1,3,1], fingers: [3,1,4,2], baseFret: 6, barres: [] },
  ];

  M["Bb"] = [
    { frets: [3,0,1,1], fingers: [2,0,1,1], baseFret: 1, barres: [1] },
    { frets: [3,0,5,1], fingers: [2,0,3,1], baseFret: 1, barres: [] },
    { frets: [3,3,5,1], fingers: [2,2,3,1], baseFret: 1, barres: [3] },
  ];

  M["Bbm"] = [
    { frets: [3,3,4,1], fingers: [2,2,3,1], baseFret: 1, barres: [3] },
    { frets: [1,1,2,4], fingers: [1,1,2,3], baseFret: 3, barres: [1] },
    { frets: [4,1,2,4], fingers: [3,1,2,4], baseFret: 3, barres: [] },
  ];

  M["Bbmaj7"] = [
    { frets: [3,0,0,1], fingers: [2,0,0,1], baseFret: 1, barres: [] },
    { frets: [2,0,1,1], fingers: [2,0,1,1], baseFret: 1, barres: [1] },
    { frets: [1,1,3,3], fingers: [1,1,2,2], baseFret: 3, barres: [1,3] },
  ];

  M["Bbm7"] = [
    { frets: [1,1,2,2], fingers: [1,1,2,2], baseFret: 3, barres: [1,2] },
    { frets: [1,1,3,1], fingers: [1,1,2,1], baseFret: 6, barres: [1] },
    { frets: [3,5,5,1], fingers: [2,3,3,1], baseFret: 4, barres: [5] },
  ];

  M["Bbdim"] = [
    { frets: [3,2,4,0], fingers: [2,1,3,0], baseFret: 1, barres: [] },
    { frets: [2,1,3,5], fingers: [2,1,3,4], baseFret: 2, barres: [] },
    { frets: [5,1,3,5], fingers: [3,1,2,4], baseFret: 2, barres: [] },
  ];

  M["Bbaug"] = [
    { frets: [3,0,1,2], fingers: [3,0,1,2], baseFret: 1, barres: [] },
    { frets: [3,0,5,2], fingers: [2,0,3,1], baseFret: 1, barres: [] },
    { frets: [2,3,4,1], fingers: [2,3,4,1], baseFret: 2, barres: [] },
  ];

  M["Bbsus2"] = [
    { frets: [3,3,3,1], fingers: [2,2,2,1], baseFret: 1, barres: [3] },
    { frets: [1,1,1,4], fingers: [1,1,1,2], baseFret: 3, barres: [1] },
    { frets: [5,3,1,1], fingers: [3,2,1,1], baseFret: 1, barres: [1] },
  ];

  M["Bbsus4"] = [
    { frets: [3,1,1,1], fingers: [2,1,1,1], baseFret: 1, barres: [1] },
    { frets: [1,1,4,4], fingers: [1,1,2,2], baseFret: 3, barres: [1,4] },
    { frets: [3,3,3,1], fingers: [2,2,2,1], baseFret: 6, barres: [3] },
  ];

  M["A#7"] = M["Bb7"];
  M["A#"] = M["Bb"];
  M["A#m"] = M["Bbm"];
  M["A#maj7"] = M["Bbmaj7"];
  M["A#m7"] = M["Bbm7"];
  M["A#dim"] = M["Bbdim"];
  M["A#aug"] = M["Bbaug"];
  M["A#sus2"] = M["Bbsus2"];
  M["A#sus4"] = M["Bbsus4"];

})();
