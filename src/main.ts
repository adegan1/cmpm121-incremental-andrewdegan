// ====================================
//  GAME STATE & UPGRADE DATA
// ====================================
const MAX_FPS = 60;
const FRAME_INTERVAL = 1000 / MAX_FPS; // Approximately 16.67ms per frame

// ====================================
//  ASSET SETUP
// ====================================
import frogSound from "./audio/frogsfx.wav";
import upgradeSound from "./audio/upgradesfx.wav";

import embryoImg from "./img/embryo.png";
import frogletImg from "./img/froglet.png";
import frogspawnImg from "./img/frogspawn.png";
import kingfrogImg from "./img/kingfrog.png";
import tadpoleImg from "./img/tadpole.png";

import mainButtonImg from "./img/mainfrog.png";
import "./style.css";

// Map of upgrade images
const UPGRADE_IMAGES: Record<string, string> = {
  "Frogspawn": frogspawnImg,
  "Embryo": embryoImg,
  "Tadpole": tadpoleImg,
  "Froglet": frogletImg,
  "King Frog": kingfrogImg,
};

// ====================================
//  UPGRADE DATA
// ====================================
interface Upgrade {
  name: string;
  cost: number;
  rate: number;
  count: number;
  desc: string;
}

const availableUpgrades: Upgrade[] = [
  {
    name: "Frogspawn",
    cost: 10,
    rate: 0.1,
    count: 0,
    desc: "The beginning of a frog's life cycle.",
  },
  {
    name: "Embryo",
    cost: 100,
    rate: 2,
    count: 0,
    desc: "A developing frog ready to hatch.",
  },
  {
    name: "Tadpole",
    cost: 1000,
    rate: 50,
    count: 0,
    desc: "A young frog that is starting to grow legs.",
  },
  {
    name: "Froglet",
    cost: 10000,
    rate: 200,
    count: 0,
    desc: "A frog that is almost fully developed.",
  },
  {
    name: "King Frog",
    cost: 100000,
    rate: 1000,
    count: 0,
    desc: "The ultimate form of a frog.",
  },
];

// Set variables
let croaks: number = 0;
const clickValue = 1;
let croaksPerSecond: number = 0;

const frogSoundInstance = new Audio(frogSound);
frogSoundInstance.volume = 0.3;
const upgradeSoundInstance = new Audio(upgradeSound);
upgradeSoundInstance.volume = 0.25;

// ====================================
//  HTML STRUCTURE
// ====================================
document.body.innerHTML = `
  <div class="main">
    <div class="titlecontainer">
    <div class = "title"><h1>Frog Frenzy</h1></div>
    <div class = "subtitle"><h3>Click the Frog to earn Croaks!</h3></div>
    </div>

    <button id="mainbutton" class = "mainbutton"><img src="${mainButtonImg}" class="mainicon" /></button><br>

    <div class="countcontainer">
    <div class = "counter"><p><span id="croaksPerSecond">${croaksPerSecond}</span> Croaks per Second</p></div>
    <div class = "subtitle"><h2>Croaks: <span id="counter">${croaks}</span></h2></div>
    </div>
  </div>

  <div class="upgrades" id="upgrade-container">
    <div class="descriptioncontainer">
      <div class="counter"><span id="descElement"><p>...</p></span></div>
    </div>
  </div>
`;

// ====================================
//  DOM ELEMENTS
// ====================================
const mainButton = document.getElementById("mainbutton")!;
const croaksPerSecondElement = document.getElementById("croaksPerSecond")!;
const counterElement = document.getElementById("counter")!;
const descElement = document.getElementById("descElement")!;

// ====================================
//  UPGRADE BUTTONS
// ====================================
const container = document.getElementById("upgrade-container")!;

availableUpgrades.forEach((upgrade) => {
  const button = document.createElement("button");
  button.id = `upgrade-${upgrade.name.toLowerCase().replace(/\s+/g, "-")}`;
  button.className = "upgradebutton";
  button.innerHTML = `
    ${upgrade.name}<br>
    <img src="${UPGRADE_IMAGES[upgrade.name]}" class="upgradeicon" /><br>
    <span id="${button.id}-info">(Cost: ${upgrade.cost})<br>(+${upgrade.rate} CpS)</span><br><br>
    <span id="${button.id}-count">Owned: ${upgrade.count}</span>
  `;
  container.appendChild(button);

  // Add button event listeners
  button.addEventListener("click", () => {
    if (croaks >= upgrade.cost) {
      croaks -= upgrade.cost;
      croaksPerSecond += upgrade.rate;
      upgrade.count++;
      upgrade.cost = +(upgrade.cost * 1.15).toFixed(1); // Increase cost by 15%

      // Update its own info span
      const infoSpan = button.querySelector("span[id$='-info']")!;
      infoSpan.innerHTML = `(Cost: ${upgrade.cost})<br>(+${upgrade.rate} CpS)`;

      // Update its own count span
      const countSpan = button.querySelector("span[id$='-count']")!;
      countSpan.textContent = `Owned: ${upgrade.count}`;

      upgradeSoundInstance.play();
    }
  });

  // Add hover description
  button.addEventListener("mouseenter", () => {
    descElement.innerHTML = upgrade.desc;
  });
  button.addEventListener("mouseleave", () => {
    descElement.innerHTML = "...";
  });
});

// Enable or disable upgrade buttons based on croaks amount
function disableButtonCheck() {
  availableUpgrades.forEach((upgrade) => {
    const button = document.getElementById(
      `upgrade-${upgrade.name.toLowerCase().replace(/\s+/g, "-")}`,
    )!;
    if (croaks >= upgrade.cost) {
      button.removeAttribute("disabled");
    } else {
      button.setAttribute("disabled", "true");
    }
  });
}

// ====================================
//  GAME LOGIC
// ====================================
function incrementCroaks(value: number) {
  croaks += value;
}

// ====================================
//  EVENT LISTENERS
// ====================================
mainButton.addEventListener("click", () => {
  frogSoundInstance.play();
  incrementCroaks(clickValue);
});

// Add funds produced by upgrades every second
setInterval(() => {
  incrementCroaks(croaksPerSecond);
}, 1000);

// ====================================
//  RENDER LOOP
// ====================================
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

  // Enable/disable upgrade buttons based on croak amount
  disableButtonCheck();

  // Update the counter display
  // Make sure values are fixed
  croaksPerSecond = +croaksPerSecond.toFixed(1);
  croaks = +croaks.toFixed(1);

  croaksPerSecondElement.innerText = croaksPerSecond.toString();
  counterElement.innerText = croaks.toString();

  // Request the next frame
  requestAnimationFrame(update);
}

// Initial update call
update();

// Make sure there is a blank line at the end of the file for committing
