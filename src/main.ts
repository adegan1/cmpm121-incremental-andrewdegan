const MAX_FPS = 60;
const FRAME_INTERVAL = 1000 / MAX_FPS; // Approximately 16.67ms per frame

import mainButtonImg from "./noun-paperclip-7598668-00449F.png";
import "./style.css";

// Set variables
let bank: number = 0;
let autoClickValue: number = 0;

// Create basic HTML structure
document.body.innerHTML = `
  <h1>CMPM 121 Incremental Game</h1>
  <p>Counter: <span id="counter">${bank}</span></p>
  <button id="mainbutton"><img src="${mainButtonImg}" class="icon" /></button>
  <button id="upgrade1"><img src="${"Upgrade 1"}" class="icon" /></button>
`;

// Add click handler
const button = document.getElementById("mainbutton")!;
const counterElement = document.getElementById("counter")!;

function incrementBank(value: number) {
  bank += value;
}

// When the player clicks the main button
button.addEventListener("click", () => {
  incrementBank(1);
});

// Add funds produced by upgrades every second
setInterval(() => {
  incrementBank(autoClickValue);
}, 1000);

// Upgrade button logic
const upgrade1Button = document.getElementById("upgrade1")!;
let upgrade1Cost = 10;

upgrade1Button.addEventListener("click", () => {
  if (bank >= upgrade1Cost) {
    bank -= upgrade1Cost;
    autoClickValue += 1;
    upgrade1Cost = Math.floor(upgrade1Cost * 1.2); // Increase cost by 20%
    upgrade1Button.innerText = `Upgrade 1 (Cost: ${upgrade1Cost})`;
  }
});

// Initialize upgrade button text
upgrade1Button.innerText = `Upgrade 1 (Cost: ${upgrade1Cost})`;

// Update the counter display every frame (max 60fps)
let previousTime = 0;

function disableButtonCheck() {
  if (bank >= upgrade1Cost) {
    upgrade1Button.removeAttribute("disabled");
  } else {
    upgrade1Button.setAttribute("disabled", "true");
  }
}

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
  counterElement.innerText = bank.toString();
  requestAnimationFrame(update);
}
update();

// Make sure there is a blank line at the end of the file for committing
