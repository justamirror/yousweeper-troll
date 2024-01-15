// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2024-01-10
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at document-start
// @grant unsafeWindow
// ==/UserScript==

(function() {
    'use strict';
    const unsafeWindow = window;

    let seedrandom = (function () {
        let module = { exports : {} }
        !function(f,a,c){var s,l=256,p="random",d=c.pow(l,6),g=c.pow(2,52),y=2*g,h=l-1;function n(n,t,r){function e(){for(var n=u.g(6),t=d,r=0;n<g;)n=(n+r)*l,t*=l,r=u.g(1);for(;y<=n;)n/=2,t/=2,r>>>=1;return(n+r)/t}var o=[],i=j(function n(t,r){var e,o=[],i=typeof t;if(r&&"object"==i)for(e in t)try{o.push(n(t[e],r-1))}catch(n){}return o.length?o:"string"==i?t:t+"\0"}((t=1==t?{entropy:!0}:t||{}).entropy?[n,S(a)]:null==n?function(){try{var n;return s&&(n=s.randomBytes)?n=n(l):(n=new Uint8Array(l),(f.crypto||f.msCrypto).getRandomValues(n)),S(n)}catch(n){var t=f.navigator,r=t&&t.plugins;return[+new Date,f,r,f.screen,S(a)]}}():n,3),o),u=new m(o);return e.int32=function(){return 0|u.g(4)},e.quick=function(){return u.g(4)/4294967296},e.double=e,j(S(u.S),a),(t.pass||r||function(n,t,r,e){return e&&(e.S&&v(e,u),n.state=function(){return v(u,{})}),r?(c[p]=n,t):n})(e,i,"global"in t?t.global:this==c,t.state)}function m(n){var t,r=n.length,u=this,e=0,o=u.i=u.j=0,i=u.S=[];for(r||(n=[r++]);e<l;)i[e]=e++;for(e=0;e<l;e++)i[e]=i[o=h&o+n[e%r]+(t=i[e])],i[o]=t;(u.g=function(n){for(var t,r=0,e=u.i,o=u.j,i=u.S;n--;)t=i[e=h&e+1],r=r*l+i[h&(i[e]=i[o=h&o+t])+(i[o]=t)];return u.i=e,u.j=o,r})(l)}function v(n,t){return t.i=n.i,t.j=n.j,t.S=n.S.slice(),t}function j(n,t){for(var r,e=n+"",o=0;o<e.length;)t[h&o]=h&(r^=19*t[h&o])+e.charCodeAt(o++);return S(t)}function S(n){return String.fromCharCode.apply(0,n)}if(j(c.random(),a),"object"==typeof module&&module.exports){module.exports=n;try{s=require("crypto")}catch(n){}}else"function"==typeof define&&define.amd?define(function(){return n}):c["seed"+p]=n}("undefined"!=typeof self?self:this,[],Math);
        return module.exports;
    })();

    let sad = 1; // smiley value after loss
    let bored = 2; // smiley value during game
    let happy = 3; // smiley value after win
    function createSweeper(s,m) {
        return `<!DOCTYPE html>
<html>

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width">
  <title>BOOM</title>
  <style>// Emacs settings: -*- mode: Fundamental; tab-width: 4; -*-
  html, body {
    padding: 0; margin: 0; height: 100%; width: 100%
  }
  #sqTable {
    border-spacing: 0px;
    background-color: #666666;
    color: #000000;
    user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    -webkit-user-select: none;
  }
  .sq, .score {
    margin: 0px;
    border: 2px solid;
    border-color: #eeeeee #999999 #999999 #eeeeee;
    background-color: #cccccc;
    padding: 0px;
    vertical-align: middle;
    text-align: center;
  }
  .sq {
    box-sizing: border-box; /* avoids jumpiness when zoomed */
    width: 24px;
    max-width: 24px; /* avoids being resized if text is too long (iOS) */
    min-width: 24px;
    height: 24px;
    min-height: 24px;
    max-height: 24px;
    font-size: 16px;
    font-weight: bold;
    line-height: 18px;
    cursor: pointer;
  }
  .sqExposed {
    background-color: #bbbbbb;
    border-width: 1px;
    border-color: #999999;
    padding: 1px;
    cursor: default;
  }
  .sqExploded, .sqIncorrect {
    color: #ff0000;
  }
  .sq1 {
    color: #3333cc;
  }
  .sq2 {
    color: #006600;
  }
  .sq3 {
    color: #cc0000;
  }
  .sq4 {
    color: #660066;
  }
  .sq5 {
    color: #006666;
  }
  /* sq0, sq6, sq7, and sq8 use basic black */
  div.counter {
    margin: 10px;
    border: 1px inset #eeeeee;
    padding-right: 3px;
    width: 1.75em;
    background-color: #000000;
    color: #ff6666;
    font-size: 24px;
    font-weight: bold;
    line-height: 1;
    text-align: right;
  }
  #mines {
    float: left;
  }</style>
</head>

<body>
  <table id="sqTable"><tbody></tbody></table>
  <script>// Emacs settings: -*- mode: Fundamental; tab-width: 4; -*-

  var width;                          // set by calling "init"
  var total;                          // set by calling "init"
  var mines;                          // set by calling "init"


  /* "adjacent" and "exposed" are indexed by square number = y*width+x */

  /* "adjacent" contains the board layout and derived state.  adjacent[i] is
     the count of mines adjacent to square i, or "mine" if square i contains
     a mine.  */
function endGame(r) { return eg(r) }
  var adjacent = new Array();         // count of adjacent mines
  var mine = 9;                       // adjacency count for a mine
  var firstClick = true;

  /* "exposed" contains the exposure state of the board.
     Values > "unexposed" represent exposed squares; these either have the
     distinquished values "exploded" or "incorrect", or some greater value
     (left over from the pending exposure queue) for plain old exposed
     squares.  Values <= "unexposed" include plain old unexposed squares, or
     one of the markers.

     During the "expose" method, the queue of pending exposures is a linked
     list through this array, using array indexes.  The method holds the head
     and tail.  "listEnd" is the tail marker.
  */
  var exposed = new Array();          // exposure state / pending exposures
  var listEnd = -1;                   // end marker in "exposed"
  var incorrect = -2;                 // incorrect flag, at end of game
  var exploded = -3;                  // exploded mine (at end of game!)
  var unexposed = -4;                 // default state at start of game
  var flagged = -5;                   // marker flag by user
  var queried = -6;                   // query flag by user

  var erasing = 0;                    // smiley absent during initialization
  var sad = 1;                        // smiley value after loss
  var bored = 2;                      // smiley value during game
  var happy = 3;                      // smiley value after win

  var flags = 0;                      // count of flags currently set
  var remaining = 0;                  // count of unexposed squares
  var sadness = happy;                // whether smiley is sad
  var startTime;                      // time of first click, if any
  var timer = false;                  // periodic elapsed time updater

  var charInfinity = "&#x221E;";
  var charFlag = "!";                 // or 2691, but not on Windows
  var charQuestion = "?";
  var charMine = "&#x2600;";
  var charIncorrect = "&#x00D7;";

  function setMines() {

  }

  function setElapsed() {

  }

  function setHappy() {

  }

  function setSq(thisSquare) {
    // update square display, based on "exposed" and "adjacent"
    var sq = document.getElementById("sq-" + thisSquare);
    var exp = exposed[thisSquare];
    var className = "sq";
    var s;
    if (exp <= unexposed) {
      // unexposed squares, including flagged or queried
      if (exp == unexposed) {
        s = "&nbsp;";
      } else if (exp == flagged) {
        s = charFlag;
        className += " sqFlagged";
      } else {
        s = charQuestion;
        className += " sqQuestion";
      }
    } else {
      // exposed squares
      var adj = adjacent[thisSquare];
      className += " sqExposed";
      if (exp == exploded) {
        s = charMine;
        className += " sqExploded";
      } else if (exp == incorrect) {
        s = charIncorrect;
        className += " sqIncorrect";
      } else if (adj == mine) {
        s = charMine;
        className += " sqMine";
      } else {
        s = "" + (adj == 0 ? "&nbsp;" : adj);
        className += " sq" + adj;
      }
    }
    sq.className = className;
    sq.innerHTML = s;
  }

  function timerAction() {

  }

  function startTimer() {

  }

  function eg(outcome) {
    // Turn off the timer and update the smiley
    timer = false;
    sadness = outcome;
    setHappy();
  }

  function applyToNeighbours(thisSquare, f) {
    // Apply given function to each existing neighbours of given square
    // This is the only part of the program that knows the topology
    // The performance of this function has a visible effect on the program
    var x = thisSquare % width;
    if (thisSquare >= width) { // there's a row above
      if (x > 0) f(thisSquare - width - 1);
      f(thisSquare - width);
      if (x+1 < width) f(thisSquare - width + 1);
    }
    if (x > 0) f(thisSquare - 1);
    if (x+1 < width) f(thisSquare + 1);
    if (thisSquare < total-width) { // there's a row below
      if (x > 0) f(thisSquare + width - 1);
      f(thisSquare + width);
      if (x+1 < width) f(thisSquare + width + 1);
    }
  }

  function getNeighbors(thisSquare) {
    let arr = [];
    applyToNeighbours(thisSquare, s=>arr.push(s));
    return arr
  }

  var tail = listEnd;                  // tail of pending exposures

  function expose1(thisSquare) {
    // Expose square and add to pending exposure list.
    if (exposed[thisSquare] <= unexposed &&
                      exposed[thisSquare] != flagged) {
      remaining--;
      exposed[thisSquare] = listEnd;
      exposed[tail] = thisSquare;
      tail = thisSquare;
      setSq(thisSquare);
    }
  }

  function clickSq(event, thisSquare) {
    if (!event) event = window.event; // IE versus the rest
    if (sadness != bored) return false; // Game over: do nothing
    if (!timer) startTimer();
    if (exposed[thisSquare] > unexposed) {
      // already exposed: do nothing
      return false;
    } else if (!event.which && event.button == 0) {
      // mouse-up after right-click on IE: do nothing
      return false;
    } else if (event.shiftKey || event.button == 2) {
      // flag or unflag
      var exp = exposed[thisSquare];
      if (exp == unexposed) {
        exposed[thisSquare] = flagged;
        flags++;
        setMines();
      } else if (exp == flagged) {
        exposed[thisSquare] = queried;
        flags--;
        setMines();
      } else if (exp == queried) {
        exposed[thisSquare] = unexposed;
      }
      setSq(thisSquare); return false;
    } else if (firstClick) {
      firstClick = false;
      layMines(thisSquare);
    }
    if (adjacent[thisSquare] == mine) {
      // exposing a mine: explode it and expose other mines
      remaining--;
      exposed[thisSquare] = exploded;
      setSq(thisSquare);
      var i;
      for (i = 0; i < total; i++) {
        if (i==thisSquare) {
        } else if (adjacent[i] == mine && exposed[i] != flagged) {
          remaining--;
          exposed[i] = listEnd;
          setSq(i);
        } else if (adjacent[i] != mine && exposed[i] == flagged) {
          remaining--;
          exposed[i] = incorrect;
          setSq(i);
        }
      }
      endGame(sad);
    } else {
      // expose the square, if not already exposed
      // If square has 0 adjacency, expose surrounding squares,
      // and iterate
      if (exposed[thisSquare] == flagged) {
        flags--;
        setMines();
      }
      remaining--;
      exposed[thisSquare] = listEnd;
      tail = thisSquare;
      setSq(thisSquare);
      var pending = thisSquare;
      // Until pending reaches the end of the exposure list, expose
      // neighbors
      while (pending != listEnd) {
        if (adjacent[pending]==0) applyToNeighbours(pending, expose1);
        pending = exposed[pending];
      }
      if (remaining==mines) {
        // End of game: flag all remaining unflagged mines
        var i;
        for (i = 0; i < total; i++) {
          if (adjacent[i] == mine && exposed[i] <= unexposed &&
                          exposed[i] != flagged ) {
            exposed[i] = flagged;
            flags++;
            setSq(i);
          }
        }
        setMines();
        endGame(happy);
      }
    }
    return false;
  }

  function neighbourIsMine(thisSquare) {
    // Increase adjacency count, if this isn't itself a mine
    if (adjacent[thisSquare] != mine) adjacent[thisSquare]++;
  }

  function layMines(firstClick) {
    // Lay the mines
    var laid = 0;
    let targets = [];
    let cannotBeMine = getNeighbors(firstClick).concat([firstClick]);
    if (window.nine) cannotBeMine = [];
    while (laid < mines) {
      var target = Math.floor(Math.random() * total);
      if (cannotBeMine.includes(target)) continue;
      // Despite what others might say, it's possible that "target
      // = total".  This is because although Math.random() is < 1,
      // in an extreme case the multiplication by "total" will round up.
      // We need to allow for this, if we really care about correctness.
      if (target < total && adjacent[target] != mine) {
        adjacent[target] = mine;
        applyToNeighbours(target, neighbourIsMine);
        laid++;
      }
    }
  }

  function eraseRows() {
    // erase square contents
    var i;
    for (i = 0; i < total; i++) {
      adjacent[i] = 0;
      if (exposed[i] != unexposed) {
        exposed[i] = unexposed;
        setSq(i);
      }
    }
  }

  function erase2() {
    // Forked part of erase
    eraseRows();
    sadness = bored;
    setHappy();
    return false;
  }

  function erase() {
    // Erase the board.  Uses "sadness" to disable clicks meanwhile
    if (sadness != erasing) {
      flags = 0;
      setMines();
      remaining = total;
      endGame(erasing);
      setElapsed();
      setTimeout("erase2()", 1); // allow repaint of score area
    }
  }

  function clickSmiley(event) {
    // Click in the smiley face.
    if (!event) event = window.event; // IE versus the rest
    if (event.button != 2) erase();
    return false;
  }

  function noContext() {
    // Disable context menu in squares
    return false;
  }

  function init(w, t, m) {
    // Initial "onload" setup.  Set up globals and handlers, then erase.
    //
    width = w;
    total = t;
    mines = m;

    // The handlers here are non-standard and fail w3.org validation if
    // placed in the HTML.  Onselectstart prevents IE extending a selection
    // on shift-click, and oncontextmenu prevents right-click being grabbed
    // for context menus on some browsers.
    var sqTable = document.getElementById("sqTable");
    sqTable.onselectstart = function() { return false; };
    var i;
    var parent = sqTable.firstElementChild;
    var curr;
    for (i = 0; i < total; i++) {
      if (i % width == 0) {
        curr = document.createElement('tr');
        parent.appendChild(curr)
      }
      var sq = document.createElement("td");
      sq.id = "sq-" + i;
      let thisSqr = i;
      sq.onclick = e=>clickSq(e, thisSqr);
      sq.oncontextmenu = e=>{
        clickSq(e, thisSqr);
        return noContext(e)
      };
      curr.appendChild(sq)
    }
    erase();
  }</script>
  <script>
  const settings = {
    width: ${s},
    mines: ${m}
  }
  if (settings.width === settings.mines) {
    window.nine = true;
    settings.height = settings.width;
    charMine = "9"
  } else {
  settings.height = Math.floor(/* set height to required to fit ratio of window size */ settings.width * (window.innerHeight / window.innerWidth));
  }settings.total = settings.width * settings.height;
  // set zoom to required to make table fit window
  (window.onresize = ()=>document.body.style.zoom = Math.min(window.innerWidth / settings.width, window.innerHeight / settings.height) / 24)();
  settings.mines = Math.floor(settings.total * settings.mines)
  </script>
  <script>init(settings.width, settings.total, settings.mines)</script>
</body>

</html>`
    }
    // ytd-thumbnail > a > yt-image > img
const config = { childList: true, subtree: true };
let injectedStyle = false;
// Callback function to execute when mutations are observed
let initalUrl = new URL(location);
let isVideoWatch = Boolean(initalUrl.searchParams.get("v")) && initalUrl.pathname.startsWith('/watch');
function whenElemExists(selector, cb) {
    if (!document.body) {
        setTimeout(()=>whenElemExists(selector, cb), 10)
        return
    }
    let old;
    const observer = new MutationObserver(function (mut) {
        if (document.querySelector(selector) && document.querySelector(selector) !== old) {
            old = document.querySelector(selector)
            cb(document.querySelector(selector), mut);
        }// .setAttribute("placeholder", "Swearch")
    })
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true
    })
}
whenElemExists("input#search", search=>setInterval(()=>search.placeholder = "Swearch"))
const callback = (mutationList, observer) => {
    let style;
    if (document.head && !injectedStyle) {
        injectedStyle = true;
        style = document.createElement("style");
        style.innerHTML = `#player { display: none !important } ytd-app { top: ${isVideoWatch ? 556 : 0}px !important } ytd-page-manager { margin-top : 0 !important }`
        style.id = "minesweeper-trol";
        document.head.appendChild(style);
        let alsoStyle = document.createElement("style");
        alsoStyle.innerHTML = `#video-preview { display: none !important } #shorts-container { display: none !important }`;
        document.head.appendChild(alsoStyle)
    } else {
        style = document.querySelector("#minesweeper-trol");
    }
    function enableStyle() {
        style.innerHTML = `#player { display: none !important } ytd-app { top: ${isVideoWatch ? 556 : 0}px !important } ytd-page-manager { margin-top : 0 !important }`
    }
    function disableStyle() {
        style.innerHTML = ``
    }
    let cont = document.querySelector('#player');
    if (!cont) return;
    let video = document.querySelector('div[aria-label="YouTube Video Player"] > div > video');
    if (!video) return;

    observer.disconnect();
    let sweeper = document.createElement('iframe');
    sweeper.style.width = `100%`;
    sweeper.style.height = `500px`;
    sweeper.style.paddingTop = "56px";
    sweeper.style.display = "none";
    let won = false
    function endGame(outcome) {
        sweeper.contentWindow.eg(outcome);
        console.log(outcome)
        if (outcome === bored) return;
        if (outcome === 0) return;
        won = outcome === happy;
        if (!won) {
            explode();
            setTimeout(()=>location.reload(), 2000)
        } else {
            clearInterval(nopb)
            video = document.getElementsByClassName('html5-main-video')[0];
            video.playbackRate = 1;
            disableStyle();
            sweeper.style.display = "none";
        }
    }
    unsafeWindow.debugE = endGame;
    function explode() {
        let myAudioElement = new Audio();
        myAudioElement.src = `data:audio/mpeg;base64,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E0UZjMiDMbrszsAzCAZNWmU1MzOFAjNzswISEJOYmeGXlIlXGolQc6jAqMlxVHTHEg1cOMnHTETYygTMABhYIFiQHEpqBkCuAxklMWIzRAYwAgGhUwQXBQY8SYa0rEtma3MtY6+rq5hcy3rtbLe+Z8///Hn//8y/LX85vnfx//7/4873f//71nrv///z95a1zvcufv//+fz//mv7///8z///udsRgk5qcu4ThQ2ONCWieNsqX0JApL//////+qmU4ko05Q4owXCQsqsdlev/////qh0P8cpw8IDCBo8SZwiykjuz+9X+VDxhAEAAJEAAAMEgpMzImMEApMKySUrUaNYysMyyJMhQGMABvSddExPA8wFDwx+Bkw5DyAHfOHMOAICxsxyltpaSuwUDKsQNAHOrrEJQSWzrhjkyMQHITha2gL2giniZixx4RQYaVpfsEnh0gYkmZgMFACwzpS+CnSoqeF6p8zCnQYQMKUAg0SBAY860zlLnhjP7vZ4SC0PBQgOkmXELZp2odLkEymxdmb1ixdw3zdtsKYq7mgL9X+nQ1iVZYx6VZ3K3M5fyvnvPDS52AMCZjDy6m1ae1dpneZWpTjqZq4WbGrF7fL2P546Xe9boPGw1lT2sle9l//u0ZHmACbKExTZ3QAIwKjYiwBwAHLXC9h2cAAkGi9fnj6ABjuNbdDdXmX4yqtnWrWuZ8zo90+f5/rn/////////////8AO24DpPDLnGgV13vcRnf/////////////9bv5ZVeamasMBBCACD//////jwPhFcRRr//Gv///8IxH/X/kB8UoIopYd///9fsbqxP/+eBFSzgsC7hhUikX8FFwIUSmo+gonNI5R9YRJsUIN9oBRLBojL9gdwS1IQGWPSI0J0KxPICjPsnMWqM4mLYN3WFaBbT1CAxJ3Yce+HYMkeNq5dr2aapP3J69K4atyqVxiL4Uku+K262u3bE1SW7OWN6mpbN62+09ao52XWaWzWqzUvlt+du3HBjN69XpJ+/ErdmNVq9jP8LWXLX53PqUMel9FVrU0ps2K+FNjTZXaS1KoerV8rFWxKZThYuzVeXd1DP1LfPs14r3lql13OpXludy1921fwtXbmON21rKlq2MbW69yav37lezkLAAkAIAA/5kwsUEhAWDVmasaPBCHBRI3FQ2w88/k34Y9eUz6A4SpBKQBCBWd2+aVIebAJmzLFkWXSRQkOVjtP2fPqACEACe/G7y5UoQooTEJcX0KGVxAJgqgEypKQlGyWqJk1GTgaGTKJ6vIkYIsNfUJEcbZWa2OSqaFZq4pTRNXGpkqSLCJtDUlXESTUUMJbJoiRkpEfQ5Fap5Lf1WVXES5KtqIquZWaVqeLYiTctvtlCo1FVgVLobQpPQwRTZjCVsrH//u0ZECA9TFfustPSCJV4tUoGzxiUUjKlg/oycAAADSAAAAExSgQwFRcMljRCzaFQmIWGo+SsGr9ahVcUiy3uVYb/xRUmSCUWIAJAAB5mTUZIySCgYBEgZYzCVLSAE3LzkLMGEk0gozHSgOm3Q3GlzznTNZpM6pPzTQoNCoY0GpDY6aMTRc89ozlhTM6ME2QnTLApMPB8eDpcptpVfqWPvt5CDbPikU0m8p1MdwJjjBNhUkxLML0MPeARTCoQPswVwDMMB8ANgOLDJhWPShXkiehgwtwYdfp8oHoqkfkkqqy2jlkbcmUSmKz6mL+TdM7NITTgSEtmm4ztubmkdZykvsaSdsJaztG5rEv++f/1/zXLMnQLWZiWVOUStT6pZ/LV6a+RX+oOct66kxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqOha/rzeSo4I6HEQYNocO3zMfzJ4xGQjNMECFUjCswfU/0iyhCGaIeaGVgRNwwsmEQEFgGniDQAooq5Yrdn7cV9icERkwJgqQGiE8FhoXFKhM//u0ZCiP824XHwP8SdAAAA0gAAABAAABpAAAACAAADSAAAAEQqPQ2AkLARH9bA1/kv5b/UGv5b/Kv/kgV//8qHZMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//u0ZAAP8AAAaQAAAAgAAA0gAAABAAABpAAAACAAADSAAAAETEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqpMQU1FMy4xMDCqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq`
        myAudioElement.addEventListener("canplaythrough", (event) => {
            /* the audio is now playable; play it if permissions allow */
            myAudioElement.play();
        });
    }
    sweeper.onload = ()=>sweeper.contentWindow.endGame = endGame;
    let pb = 1;
    function generate() {
        enableStyle()
        video = document.getElementsByClassName('html5-main-video')[0];
        pb = video.playbackRate;
        nopb = setInterval(()=>{
            video = document.getElementsByClassName('html5-main-video')[0];
            video.playbackRate = 0
        }, 1)
        let random = seedrandom(ovb)
        let mines;
        if (random() > 0.7) {
            mines = (random()*0.5)+0.3
        } else {
            mines = (random()*0.4);
        }
        sweeper.srcdoc = createSweeper(Math.floor(random()*21)+10, mines);
        sweeper.style.display = ""
        cont.style = ""
    }
    let time;
    let ovb = new URLSearchParams(location.search).get("v");
    let nopb;
    if (ovb) {
        generate()
    } else {
        disableStyle()
    }
    let int = setInterval(function (mut) {
        if (location.pathname.startsWith('/shorts/') && document.body) {
            window.stop();
            document.body.innerHTML = ""
            document.body.style = "text-align: center; padding: 0;overflow:hidden";
            let iframe = document.createElement('iframe');
            iframe.onload = ()=>iframe.contentWindow.endGame = function (outcome) {
                if (outcome === sad) {
                    setInterval(()=>{
                        explode()
                    }, 10);
                    setTimeout(()=>location.pathname = "/", 5000);
                }
            }
            iframe.srcdoc = createSweeper(1,1);
            iframe.style = "height: 100dvh; width: 100dvh;height: 100vh; width: 100vh;";
            document.body.appendChild(iframe)

            clearInterval(int)
        }
        if (ovb !== new URLSearchParams(location.search).get("v")) {
            ovb = new URLSearchParams(location.search).get("v");
            if (ovb) {
                generate()
            } else {
                disableStyle()
            }
        };
    });
    cont.after(sweeper);
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(document.documentElement, config);
})();