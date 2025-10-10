const MAX_FPS = 60;
const FRAME_INTERVAL = 1000 / MAX_FPS; // Approximately 16.67ms per frame

import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";

// Simple counter
let bank: number = 0;

// Create basic HTML structure
document.body.innerHTML = `
  <h1>CMPM 121 Incremental Game</h1>
  <p>Counter: <span id="counter">${bank}</span></p>
  <button id="increment"><img src="${exampleIconUrl}" class="icon" /></button>
`;

// Add click handler
const button = document.getElementById("increment")!;
const counterElement = document.getElementById("counter")!;

function incrementBank(value: number) {
  bank += value;
}

// When the player clicks the main button
button.addEventListener("click", () => {
  incrementBank(1);
});

// Testing set interval
setInterval(() => {
  incrementBank(1);
}, 1000);

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

  // Update the counter display
  counterElement.innerText = bank.toString();
  requestAnimationFrame(update);
}
update();

// Make sure there is a blank line at the end of the file for committing
