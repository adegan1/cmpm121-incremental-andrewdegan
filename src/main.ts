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
  counterElement.textContent = bank.toString();
}

// When the player clicks the main button
button.addEventListener("click", () => {
  incrementBank(1);
  console.log("I have these thingies:", button, counterElement, bank);
});

// Make sure there is a blank line at the end of the file for committing
