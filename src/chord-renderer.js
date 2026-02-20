(function () {
  "use strict";

  var W = 142;
  var H = 186;
  var STRINGS = 4;
  var FRETS = 5;

  // Grid geometry
  var GRID_L = 41;
  var GRID_R = 101;
  var GRID_T = 25;
  var FRET_H = 24;
  var STR_GAP = (GRID_R - GRID_L) / (STRINGS - 1);

  // Marker position (open/mute indicators above nut)
  var MARKER_Y = 6;

  // Visual constants
  var COLOR = "#000";
  var NUT_H = 5;
  var LINE_W = 1.5;
  var DOT_R = 9;
  var MARKER_R = 5;

  function strX(i) {
    return GRID_L + i * STR_GAP;
  }

  function fretY(f) {
    return GRID_T + f * FRET_H;
  }

  function dotCenterY(f) {
    return fretY(f) - FRET_H / 2;
  }

  function renderChord(canvas, voicing) {
    canvas.width = W;
    canvas.height = H;
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, W, H);

    var isNut = voicing.baseFret === 1;

    // Nut (thick bar at top) or fret position label
    if (isNut) {
      ctx.fillStyle = COLOR;
      ctx.fillRect(
        GRID_L - 1,
        GRID_T - NUT_H,
        GRID_R - GRID_L + 2,
        NUT_H
      );
    } else {
      ctx.fillStyle = COLOR;
      ctx.font = "19px Arial,sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(voicing.baseFret, GRID_R + 8, dotCenterY(1));
    }

    // Fret lines (horizontal)
    ctx.strokeStyle = COLOR;
    ctx.lineWidth = LINE_W;
    for (var f = 0; f <= FRETS; f++) {
      ctx.beginPath();
      ctx.moveTo(GRID_L, fretY(f));
      ctx.lineTo(GRID_R, fretY(f));
      ctx.stroke();
    }

    // String lines (vertical)
    for (var s = 0; s < STRINGS; s++) {
      ctx.beginPath();
      ctx.moveTo(strX(s), GRID_T);
      ctx.lineTo(strX(s), fretY(FRETS));
      ctx.stroke();
    }

    // Barres — capsule shape spanning barred strings
    var barred = {};
    if (voicing.barres) {
      for (var b = 0; b < voicing.barres.length; b++) {
        var bf = voicing.barres[b];
        var first = -1;
        var last = -1;
        for (var i = 0; i < STRINGS; i++) {
          if (voicing.frets[i] === bf) {
            if (first === -1) first = i;
            last = i;
          }
        }
        if (first >= 0 && last > first) {
          var by = dotCenterY(bf);
          var hr = DOT_R * 0.65;
          ctx.fillStyle = COLOR;
          ctx.beginPath();
          ctx.arc(strX(first), by, hr, Math.PI * 0.5, Math.PI * 1.5);
          ctx.arc(strX(last), by, hr, -Math.PI * 0.5, Math.PI * 0.5);
          ctx.closePath();
          ctx.fill();
          for (var j = first; j <= last; j++) {
            if (voicing.frets[j] === bf) barred[j] = true;
          }
        }
      }
    }

    // Finger dots and open/mute markers
    for (var i = 0; i < STRINGS; i++) {
      var fr = voicing.frets[i];
      var x = strX(i);

      if (fr === -1) {
        // Muted string — X above nut
        var m = 4.5;
        ctx.strokeStyle = COLOR;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - m, MARKER_Y - m);
        ctx.lineTo(x + m, MARKER_Y + m);
        ctx.moveTo(x + m, MARKER_Y - m);
        ctx.lineTo(x - m, MARKER_Y + m);
        ctx.stroke();
      } else if (fr === 0) {
        // Open string — circle above nut
        ctx.strokeStyle = COLOR;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(x, MARKER_Y, MARKER_R, 0, Math.PI * 2);
        ctx.stroke();
      } else if (!barred[i]) {
        // Fretted string — filled dot with finger number
        var dy = dotCenterY(fr);
        ctx.fillStyle = COLOR;
        ctx.beginPath();
        ctx.arc(x, dy, DOT_R, 0, Math.PI * 2);
        ctx.fill();

        var fin = voicing.fingers ? voicing.fingers[i] : 0;
        if (fin > 0) {
          ctx.fillStyle = "#000";
          ctx.font = "bold 11px Arial,sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(fin.toString(), x, dy);
        }
      }
    }
  }

  window.MandolinRenderer = { renderChord: renderChord };
})();
