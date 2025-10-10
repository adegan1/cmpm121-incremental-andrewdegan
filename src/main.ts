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
  console.log("I have these thingies:", button, counterElement, bank);
});

// Testing set interval
setInterval(() => {
  incrementBank(1);
}, 1000);

// Update the counter display every frame
function update() {
  counterElement.innerText = bank.toString();
  requestAnimationFrame(update);
}
update();

// Make sure there is a blank line at the end of the file for committing
