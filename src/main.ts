const MAX_FPS = 60;
const FRAME_INTERVAL = 1000 / MAX_FPS; // Approximately 16.67ms per frame

import mainButtonImg from "./noun-paperclip-7598668-00449F.png";
import "./style.css";

// Set variables
let bank: number = 0;
const clickValue = 1;
let autoClickValue: number = 0;

const upgrade1Cost = 10;
const upgrade2Cost = 100;
const upgrade3Cost = 1000;

let upgrade1Count = 0;
let upgrade2Count = 0;
let upgrade3Count = 0;

const upgrade1Value = 0.1;
const upgrade2Value = 2.0;
const upgrade3Value = 50.0;

// Create basic HTML structure
document.body.innerHTML = `
  <h1>CMPM 121 Incremental Game</h1>
  <p><span id="autoclickvalue">${autoClickValue}</span> items per second</p>
  <p>Counter: <span id="counter">${bank}</span></p>

  <button id="mainbutton"><img src="${mainButtonImg}" class="icon" /></button>

  <button id="upgrade1">Upgrade 1 (Cost: ${upgrade1Cost})<br>(+ ${upgrade1Value} items per second)</button>
  <button id="upgrade2">Upgrade 2 (Cost: ${upgrade2Cost})<br>(+ ${upgrade2Value} items per second)</button>
  <button id="upgrade3">Upgrade 3 (Cost: ${upgrade3Cost})<br>(+ ${upgrade3Value} items per second)</button>

  <p>Upgrade 1: <span id="upgradeCount1">${upgrade1Count}</span></p>
  <p>Upgrade 2: <span id="upgradeCount2">${upgrade2Count}</span></p>
  <p>Upgrade 3: <span id="upgradeCount3">${upgrade3Count}</span></p>
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
  incrementBank(clickValue);
});

// Add funds produced by upgrades every second
setInterval(() => {
  incrementBank(autoClickValue);
}, 1000);

// Upgrade button logic
const upgrade1Button = document.getElementById("upgrade1")!;
const upgrade2Button = document.getElementById("upgrade2")!;
const upgrade3Button = document.getElementById("upgrade3")!;

upgrade1Button.addEventListener("click", () => {
  if (bank >= upgrade1Cost) {
    bank -= upgrade1Cost;
    autoClickValue += upgrade1Value;
    upgrade1Count++;
    upgrade1Button.innerText =
      `Upgrade 1 (Cost: ${upgrade1Cost})\n(+ ${upgrade1Value} items per second)`;
  }
});

upgrade2Button.addEventListener("click", () => {
  if (bank >= upgrade2Cost) {
    bank -= upgrade2Cost;
    autoClickValue += upgrade2Value;
    upgrade2Count++;
    upgrade2Button.innerText =
      `Upgrade 2 (Cost: ${upgrade2Cost})\n(+ ${upgrade2Value} items per second)`;
  }
});

upgrade3Button.addEventListener("click", () => {
  if (bank >= upgrade3Cost) {
    bank -= upgrade3Cost;
    autoClickValue += upgrade3Value;
    upgrade3Count++;
    upgrade3Button.innerText =
      `Upgrade 3 (Cost: ${upgrade3Cost})\n(+ ${upgrade3Value} items per second)`;
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

  upgrade1CountElement.innerText = upgrade1Count.toString();
  upgrade2CountElement.innerText = upgrade2Count.toString();
  upgrade3CountElement.innerText = upgrade3Count.toString();

  requestAnimationFrame(update);
}

update();

// Make sure there is a blank line at the end of the file for committing
