(function () {
  "use strict";

  var TAB_KEY = "mandolin";
  var DIAGRAMS_PER_CHORD = 3;
  var initialized = false;
  var PREFIX = "[mandolin-chords]";

  function log() {
    var args = [PREFIX].concat(Array.prototype.slice.call(arguments));
    console.log.apply(console, args);
  }

  function warn() {
    var args = [PREFIX].concat(Array.prototype.slice.call(arguments));
    console.warn.apply(console, args);
  }

  function findChordsHeading() {
    var headings = document.querySelectorAll("h2");
    for (var i = 0; i < headings.length; i++) {
      if (headings[i].textContent.trim() === "Chords") return headings[i];
    }
    return null;
  }

  function findTablist(chordsHeading) {
    var sibling = chordsHeading.nextElementSibling;
    while (sibling) {
      if (sibling.getAttribute("role") === "tablist") return sibling;
      var nested = sibling.querySelector('[role="tablist"]');
      if (nested) return nested;
      sibling = sibling.nextElementSibling;
    }
    var parent = chordsHeading.parentElement;
    while (parent) {
         var possibleTablist = parent.querySelector('[role="tablist"]');
         if (possibleTablist) {
             return possibleTablist;
         } else {
             parent = parent.parentElement;
         }
    }
    if (parent) return parent.querySelector('[role="tablist"]');
    return null;
  }

  function findTabpanel(tablist) {
    var container = tablist.parentElement;
    if (!container) return null;
    var panel = container.querySelector('[role="tabpanel"]');
    if (panel) return panel;
    var sibling = tablist.nextElementSibling;
    while (sibling) {
      if (sibling.getAttribute("role") === "tabpanel") return sibling;
      var nested = sibling.querySelector('[role="tabpanel"]');
      if (nested) return nested;
      sibling = sibling.nextElementSibling;
    }
    return null;
  }

  function extractChordNames(tabpanel) {
    var names = [];
    var sections = tabpanel.querySelectorAll("section");
    sections.forEach(function (section) {
      var span = section.querySelector("span");
      if (span) {
        var name = span.textContent.trim();
        if (name) names.push(name);
      }
    });
    if (names.length === 0) {
      var spans = tabpanel.querySelectorAll("span");
      spans.forEach(function (span) {
        var text = span.textContent.trim();
        if (text && text.length <= 10 && /^[A-G]/.test(text)) names.push(text);
      });
    }
    log(names);
    return names;
  }

  function findUnderline(tablist) {
    var children = tablist.children;
    for (var i = 0; i < children.length; i++) {
      var el = children[i];
      if (el.getAttribute("role") !== "tab" && el.tagName !== "BUTTON") {
        var style = window.getComputedStyle(el);
        if (
          parseInt(style.height, 10) <= 4 ||
          el.style.height === "2px" ||
          el.style.height === "3px"
        ) {
          return el;
        }
      }
    }
    return null;
  }

  function createMandolinTab(tablist, referenceTab) {
    var tab = document.createElement("div");
    tab.setAttribute("role", "tab");
    tab.setAttribute("data-key", TAB_KEY);
    tab.setAttribute("aria-selected", "false");
    tab.setAttribute("tabindex", "-1");
    tab.textContent = "Mandolin";
    tab.className = "mandolin-tab";

    if (referenceTab) {
      var refClasses = referenceTab.className;
      log(referenceTab);
      if (refClasses) {
        tab.className = refClasses + " mandolin-tab";
      }
      var refStyle = window.getComputedStyle(referenceTab);
      tab.style.cursor = "pointer";
      tab.style.fontSize = refStyle.fontSize;
      tab.style.fontWeight = refStyle.fontWeight;
      tab.style.fontFamily = refStyle.fontFamily;
      tab.style.color = refStyle.color;
      tab.style.padding = refStyle.padding;
      tab.style.textTransform = refStyle.textTransform;
    }

    var underline = findUnderline(tablist);
    if (underline) {
      tablist.insertBefore(tab, underline);
    } else {
      tablist.appendChild(tab);
    }

    return tab;
  }

  function buildMandolinPanel(chordNames, referencePanel) {
    var panel = document.createElement("div");
    panel.setAttribute("role", "tabpanel");
    panel.className = "mandolin-panel";
    panel.style.display = "none";

    chordNames.forEach(function (name) {
      var voicings = window.MandolinChords && window.MandolinChords[name];
      if (!voicings || voicings.length === 0) return;

      var section = document.createElement("section");
      section.className = "mandolin-chord-section";

      var label = document.createElement("span");
      label.className = "mandolin-chord-name";
      label.textContent = name;
      section.appendChild(label);

      var diagramWrap = document.createElement("div");
      diagramWrap.className = "mandolin-diagrams";

      var count = Math.min(voicings.length, DIAGRAMS_PER_CHORD);
      for (var i = 0; i < count; i++) {
        var canvas = document.createElement("canvas");
        canvas.width = 142;
        canvas.height = 186;
        canvas.className = "mandolin-canvas";
        window.MandolinRenderer.renderChord(canvas, voicings[i]);
        diagramWrap.appendChild(canvas);
      }

      section.appendChild(diagramWrap);
      panel.appendChild(section);
    });

    if (panel.children.length === 0) {
      var msg = document.createElement("p");
      msg.className = "mandolin-no-chords";
      msg.textContent = "No mandolin chord data available for this song.";
      panel.appendChild(msg);
    }

    return panel;
  }

  function deselectAllTabs(tablist) {
    var tabs = tablist.querySelectorAll('[role="tab"]');
    tabs.forEach(function (t) {
      t.setAttribute("aria-selected", "false");
    });
  }

  function selectTab(tab) {
    tab.setAttribute("aria-selected", "true");
  }

  function moveUnderline(tablist, targetTab) {
    var underline = findUnderline(tablist);
    if (!underline) return;
    var tablistRect = tablist.getBoundingClientRect();
    var tabRect = targetTab.getBoundingClientRect();
    underline.style.transform =
      "translateX(" + (tabRect.left - tablistRect.left) + "px)";
    underline.style.width = tabRect.width + "px";
  }

  function init() {
    if (initialized) return;
    if (!window.MandolinChords || !window.MandolinRenderer) {
      warn("chord data or renderer not loaded yet");
      return;
    }

    var chordsHeading = findChordsHeading();
    if (!chordsHeading) {
      log("waiting for Chords heading");
      return;
    }

    var tablist = findTablist(chordsHeading);
    if (!tablist) {
      warn("tablist not found near Chords heading", chordsHeading);
      return;
    }

    var existingPanel = findTabpanel(tablist);
    if (!existingPanel) {
      warn("tabpanel not found near tablist", tablist);
      return;
    }

    if (tablist.querySelector('[data-key="' + TAB_KEY + '"]')) {
      log("tab already injected, skipping");
      return;
    }

    var chordNames = extractChordNames(existingPanel);
    if (chordNames.length === 0) {
      warn("no chord names found in tabpanel");
      return;
    }
    log("found chords:", chordNames.join(", "));

    var missing = chordNames.filter(function (n) {
      return !window.MandolinChords[n];
    });
    if (missing.length > 0) {
      warn("no mandolin data for:", missing.join(", "));
    }

    var existingTabs = tablist.querySelectorAll('[role="tab"]');
    var referenceTab = existingTabs.length > 0 ? existingTabs[0] : null;

    var mandolinTab = createMandolinTab(tablist, referenceTab);
    var mandolinPanel = buildMandolinPanel(chordNames, existingPanel);

    var panelContainer = existingPanel.parentElement;
    panelContainer.appendChild(mandolinPanel);
    log("injected mandolin tab and panel");

    mandolinTab.addEventListener("click", function () {
      deselectAllTabs(tablist);
      selectTab(mandolinTab);
      moveUnderline(tablist, mandolinTab);

      var panels = panelContainer.querySelectorAll('[role="tabpanel"]');
      panels.forEach(function (p) {
        if (p !== mandolinPanel) p.style.display = "none";
      });
      mandolinPanel.style.display = "";
    });

    existingTabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        mandolinTab.setAttribute("aria-selected", "false");
        mandolinPanel.style.display = "none";

        var panels = panelContainer.querySelectorAll('[role="tabpanel"]');
        panels.forEach(function (p) {
          if (p !== mandolinPanel) p.style.display = "";
        });
      });
    });

    initialized = true;
    observeReRenders(tablist, panelContainer);
    log("initialized");
  }

  function observeReRenders(tablist, panelContainer) {
    var container = tablist.parentElement;
    if (!container) return;

    var observer = new MutationObserver(function () {
      if (!tablist.querySelector('[data-key="' + TAB_KEY + '"]')) {
        log("tab removed by React re-render, re-injecting");
        initialized = false;
        init();
      }
    });

    observer.observe(container, { childList: true, subtree: true });
  }

  function waitForElements() {
    if (
      window.MandolinChords &&
      window.MandolinRenderer &&
      findChordsHeading()
    ) {
      init();
      return;
    }

    var observer = new MutationObserver(function (_mutations, obs) {
      if (
        window.MandolinChords &&
        window.MandolinRenderer &&
        findChordsHeading()
      ) {
        obs.disconnect();
        init();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function onUrlChange() {
    log("URL changed, resetting");
    initialized = false;
    var existing = document.querySelector(".mandolin-tab");
    if (existing) existing.remove();
    var panel = document.querySelector(".mandolin-panel");
    if (panel) panel.remove();

    setTimeout(waitForElements, 500);
  }

  if (!window.__MANDOLIN_TEST__) {
    // SPA navigation: detect URL changes via pushState/replaceState and popstate
    var lastUrl = location.href;

    function checkUrlChange() {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        onUrlChange();
      }
    }

    var origPushState = history.pushState;
    history.pushState = function () {
      origPushState.apply(this, arguments);
      checkUrlChange();
    };

    var origReplaceState = history.replaceState;
    history.replaceState = function () {
      origReplaceState.apply(this, arguments);
      checkUrlChange();
    };

    window.addEventListener("popstate", checkUrlChange);

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", waitForElements);
    } else {
      waitForElements();
    }
  }

  if (window.__MANDOLIN_TEST__) {
    window.__MandolinContentInternals__ = {
      findChordsHeading: findChordsHeading,
      findTablist: findTablist,
      findTabpanel: findTabpanel,
      extractChordNames: extractChordNames,
      findUnderline: findUnderline,
      createMandolinTab: createMandolinTab,
      buildMandolinPanel: buildMandolinPanel,
      deselectAllTabs: deselectAllTabs,
      selectTab: selectTab,
      moveUnderline: moveUnderline,
      init: init
    };
    window.__MANDOLIN_TEST_RESET__ = function () { initialized = false; };
  }
})();
