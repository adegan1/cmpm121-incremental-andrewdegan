const MAX_FPS = 60;
const FRAME_INTERVAL = 1000 / MAX_FPS; // Approximately 16.67ms per frame

import upgrade2Img from "./img/embryo.png";
import upgrade1Img from "./img/frogspawn.png";
import mainButtonImg from "./img/mainfrog.png";
import upgrade3Img from "./img/tadpole.png";
//import upgrade4Img from "./img/froglet.png";
//import upgrade5Img from "./img/kingfrog.png";
import frogSound from "./audio/frogsfx.wav";
import upgradeSound from "./audio/upgradesfx.wav";
import "./style.css";

// Set variables
let bank: number = 0;
const clickValue = 1;
let autoClickValue: number = 0;

const frogSoundInstance = new Audio(frogSound);
frogSoundInstance.volume = 0.3;
const upgradeSoundInstance = new Audio(upgradeSound);
upgradeSoundInstance.volume = 0.25;

// Upgrade variables
// 5 upgrades: Frogspawn, Embryo, Tadpole, Froglet, Frog King
let upgrade1Cost = 10;
let upgrade2Cost = 100;
let upgrade3Cost = 1000;

let upgrade1Count = 0;
let upgrade2Count = 0;
let upgrade3Count = 0;

const upgrade1Value = 0.1;
const upgrade2Value = 2.0;
const upgrade3Value = 50.0;

// Create basic HTML structure
document.body.innerHTML = `
  <div class="titlecontainer">
  <div class = "title"><h1>Frog Frenzy</h1></div>
  <div class = "subtitle"><h3>Click the frog to earn Croaks!</h3></div>
  </div>
  <div class="countcontainer">
  <div class = "counter"><p><span id="autoclickvalue">${autoClickValue}</span> Croaks per Second</p></div>
  <div class = "subtitle"><h2>Croaks: <span id="counter">${bank}</span></h2></div>
  </div>

  <button id="mainbutton" class = "mainbutton"><img src="${mainButtonImg}" class="mainicon" /></button><br>

  <div class="upgradetextcontainer">
    <div class="subtitle"><h3>Upgrades</h3></div>
  </div>

  <div class="upgradecontainer">
  <button id="upgrade1" class = "upgradebutton">Frogspawn<br><img src="${upgrade1Img}" class="upgradeicon" /><br>
    <span id="upgrade1Info">(Cost: ${upgrade1Cost})<br>
    (+ ${upgrade1Value} CpS)</span><br><br>
    <span id="upgradeCount1">Owned: ${upgrade1Count}</span></button>

  <button id="upgrade2" class = "upgradebutton">Embryo<br><img src="${upgrade2Img}" class="upgradeicon" /><br>
    <span id="upgrade2Info">(Cost: ${upgrade2Cost})<br>
    (+ ${upgrade2Value} CpS)</span><br><br>
    <span id="upgradeCount2">Owned: ${upgrade2Count}</span></button>

  <button id="upgrade3" class = "upgradebutton">Tadpole<br><img src="${upgrade3Img}" class="upgradeicon" /><br>
    <span id="upgrade3Info">(Cost: ${upgrade3Cost})<br>
    (+ ${upgrade3Value} CpS)</span><br><br>
    <span id="upgradeCount3">Owned: ${upgrade3Count}</span></button>
  </div>
`;

// Get HTML elements
const mainButton = document.getElementById("mainbutton")!;
const autoClickValueElement = document.getElementById("autoclickvalue")!;
const counterElement = document.getElementById("counter")!;

const upgrade1CountElement = document.getElementById("upgradeCount1")!;
const upgrade2CountElement = document.getElementById("upgradeCount2")!;
const upgrade3CountElement = document.getElementById("upgradeCount3")!;

function incrementBank(value: number) {
  bank += value;
}

// When the player clicks the main button
mainButton.addEventListener("click", () => {
  frogSoundInstance.play();
  incrementBank(clickValue);
});

// Add funds produced by upgrades every second
setInterval(() => {
  incrementBank(autoClickValue);
}, 1000);

// Upgrade button logic
const upgrade1Button = document.getElementById("upgrade1")!;
const upgrade1Info = document.getElementById("upgrade1Info")!;
const upgrade2Button = document.getElementById("upgrade2")!;
const upgrade2Info = document.getElementById("upgrade2Info")!;
const upgrade3Button = document.getElementById("upgrade3")!;
const upgrade3Info = document.getElementById("upgrade3Info")!;

upgrade1Button.addEventListener("click", () => {
  if (bank >= upgrade1Cost) {
    bank -= upgrade1Cost;
    autoClickValue += upgrade1Value;
    upgrade1Count++;
    upgrade1Cost = +(upgrade1Cost * 1.15).toFixed(1); // Increase cost by 15%
    upgradeSoundInstance.play();
    upgrade1Info.innerText =
      `(Cost: ${upgrade1Cost})\n(+ ${upgrade1Value} CpS)`;
  }
});

upgrade2Button.addEventListener("click", () => {
  if (bank >= upgrade2Cost) {
    bank -= upgrade2Cost;
    autoClickValue += upgrade2Value;
    upgrade2Count++;
    upgrade2Cost = +(upgrade2Cost * 1.15).toFixed(1); // Increase cost by 15%
    upgradeSoundInstance.play();
    upgrade2Info.innerText =
      `(Cost: ${upgrade2Cost})\n(+ ${upgrade2Value} CpS)`;
  }
});

upgrade3Button.addEventListener("click", () => {
  if (bank >= upgrade3Cost) {
    bank -= upgrade3Cost;
    autoClickValue += upgrade3Value;
    upgrade3Count++;
    upgrade3Cost = +(upgrade3Cost * 1.15).toFixed(1); // Increase cost by 15%
    upgradeSoundInstance.play();
    upgrade3Info.innerText =
      `(Cost: ${upgrade3Cost})\n(+ ${upgrade3Value} CpS)`;
  }
});

// Enable or disable upgrade buttons based on bank amount
function disableButtonCheck() {
  if (bank >= upgrade1Cost) {
    upgrade1Button.removeAttribute("disabled");
  } else {
    upgrade1Button.setAttribute("disabled", "true");
  }

  if (bank >= upgrade2Cost) {
    upgrade2Button.removeAttribute("disabled");
  } else {
    upgrade2Button.setAttribute("disabled", "true");
  }

  if (bank >= upgrade3Cost) {
    upgrade3Button.removeAttribute("disabled");
  } else {
    upgrade3Button.setAttribute("disabled", "true");
  }
}

// Update the counter display every frame (max 60fps)
let previousTime = 0;

function update() {
  // Calculate time since last frame
  const deltaTime = performance.now() - previousTime;

  // Maintain 60fps maximum
  if (deltaTime < FRAME_INTERVAL) {
    requestAnimationFrame(update);
    return; // Skip this frame to maintain max FPS
  }
  previousTime = performance.now();

  // Enable/disable upgrade buttons based on bank amount
  disableButtonCheck();

  // Update the counter display
  // Make sure values are fixed
  autoClickValue = +autoClickValue.toFixed(1);
  bank = +bank.toFixed(1);

  autoClickValueElement.innerText = autoClickValue.toString();
  counterElement.innerText = bank.toString();

  upgrade1CountElement.innerText = "Owned: " + upgrade1Count.toString();
  upgrade2CountElement.innerText = "Owned: " + upgrade2Count.toString();
  upgrade3CountElement.innerText = "Owned: " + upgrade3Count.toString();

  requestAnimationFrame(update);
}

update();

// Make sure there is a blank line at the end of the file for committing
