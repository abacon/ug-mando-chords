(function () {
  var M = window.MandolinChords;

  M["Db7"] = [
    { frets: [2,1,2,2], fingers: [2,1,2,2], baseFret: 3, barres: [2] },
    { frets: [5,2,1,3], fingers: [4,2,1,3], baseFret: 2, barres: [] },
    { frets: [1,1,3,2], fingers: [1,1,3,2], baseFret: 6, barres: [1] },
  ];

  M["Db"] = [
    { frets: [4,1,2,2], fingers: [3,1,2,2], baseFret: 3, barres: [2] },
    { frets: [1,3,4,1], fingers: [1,3,4,2], baseFret: 1, barres: [] },
    { frets: [1,3,4,4], fingers: [1,2,3,3], baseFret: 1, barres: [4] },
  ];

  M["Dbm"] = [
    { frets: [1,2,4,0], fingers: [1,2,3,0], baseFret: 1, barres: [] },
    { frets: [1,2,4,4], fingers: [1,2,3,3], baseFret: 1, barres: [4] },
    { frets: [5,1,3,3], fingers: [3,1,2,2], baseFret: 2, barres: [3] },
  ];

  M["Dbmaj7"] = [
    { frets: [4,1,1,2], fingers: [3,1,1,2], baseFret: 3, barres: [1] },
    { frets: [3,1,2,2], fingers: [3,1,2,2], baseFret: 3, barres: [2] },
    { frets: [1,1,3,3], fingers: [1,1,2,2], baseFret: 6, barres: [1,3] },
  ];

  M["Dbm7"] = [
    { frets: [3,1,3,3], fingers: [2,1,2,2], baseFret: 2, barres: [3] },
    { frets: [1,1,2,2], fingers: [1,1,2,2], baseFret: 6, barres: [1,2] },
    { frets: [5,1,1,3], fingers: [3,1,1,2], baseFret: 2, barres: [1] },
  ];

  M["Dbdim"] = [
    { frets: [0,2,4,0], fingers: [0,1,2,0], baseFret: 1, barres: [] },
    { frets: [0,2,4,3], fingers: [0,1,3,2], baseFret: 1, barres: [] },
    { frets: [0,5,4,0], fingers: [0,2,1,0], baseFret: 1, barres: [] },
  ];

  M["Dbaug"] = [
    { frets: [4,1,2,3], fingers: [4,1,2,3], baseFret: 3, barres: [] },
    { frets: [2,3,4,1], fingers: [2,3,4,1], baseFret: 1, barres: [] },
    { frets: [1,2,3,4], fingers: [1,2,3,4], baseFret: 2, barres: [] },
  ];

  M["Dbsus2"] = [
    { frets: [3,3,3,1], fingers: [2,2,2,1], baseFret: 4, barres: [3] },
    { frets: [1,1,4,4], fingers: [1,1,2,2], baseFret: 1, barres: [1,4] },
    { frets: [1,1,1,4], fingers: [1,1,1,2], baseFret: 6, barres: [1] },
  ];

  M["Dbsus4"] = [
    { frets: [3,1,1,1], fingers: [2,1,1,1], baseFret: 4, barres: [1] },
    { frets: [1,4,4,2], fingers: [1,3,3,2], baseFret: 1, barres: [4] },
    { frets: [1,4,4,4], fingers: [1,2,2,2], baseFret: 1, barres: [4] },
  ];

  M["C#7"] = M["Db7"];
  M["C#"] = M["Db"];
  M["C#m"] = M["Dbm"];
  M["C#maj7"] = M["Dbmaj7"];
  M["C#m7"] = M["Dbm7"];
  M["C#dim"] = M["Dbdim"];
  M["C#aug"] = M["Dbaug"];
  M["C#sus2"] = M["Dbsus2"];
  M["C#sus4"] = M["Dbsus4"];

})();
