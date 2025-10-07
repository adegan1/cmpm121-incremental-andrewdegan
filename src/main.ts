import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";

// Simple counter for demonstration
let counter: number = 0;

// Create basic HTML structure
document.body.innerHTML = `
  <h1>CMPM 121 Incremental Game</h1>
  <p>Counter: <span id="counter">${counter}</span></p>
  <button id="increment"><img src="${exampleIconUrl}" class="icon" /></button>
`;

// Add click handler
const button = document.getElementById("increment")!;
const counterElement = document.getElementById("counter")!;

button.addEventListener("click", () => {
  // This looks like to a good place to add some logic!
  counter += 1;
  counterElement.textContent = counter.toString();
  console.log("I have these thingies:", button, counterElement, counter);
});
