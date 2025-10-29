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
let bank: number = 0;
const clickValue = 1;
let autoClickValue: number = 0;

const frogSoundInstance = new Audio(frogSound);
frogSoundInstance.volume = 0.3;
const upgradeSoundInstance = new Audio(upgradeSound);
upgradeSoundInstance.volume = 0.25;

// ====================================
//  HTML STRUCTURE
// ====================================
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

  <div class="upgradecontainer" id="upgrade-container"></div>

  <div class="descriptioncontainer">
    <div class="counter"><span id="descElement"><p>...</p></span></div>
  </div>
`;

// ====================================
//  DOM ELEMENTS
// ====================================
const mainButton = document.getElementById("mainbutton")!;
const autoClickValueElement = document.getElementById("autoclickvalue")!;
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
    <img src="${getUpgradeImage(upgrade.name)}" class="upgradeicon" /><br>
    <span id="${button.id}-info">(Cost: ${upgrade.cost})<br>(+${upgrade.rate} CpS)</span><br><br>
    <span id="${button.id}-count">Owned: ${upgrade.count}</span>
  `;
  container.appendChild(button);

  // Add button event listeners
  button.addEventListener("click", () => {
    if (bank >= upgrade.cost) {
      bank -= upgrade.cost;
      autoClickValue += upgrade.rate;
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

function getUpgradeImage(name: string): string {
  switch (name) {
    case "Frogspawn":
      return frogspawnImg;
    case "Embryo":
      return embryoImg;
    case "Tadpole":
      return tadpoleImg;
    case "Froglet":
      return frogletImg;
    case "King Frog":
      return kingfrogImg;
  }
  return "";
}

// Enable or disable upgrade buttons based on bank amount
function disableButtonCheck() {
  availableUpgrades.forEach((upgrade) => {
    const button = document.getElementById(
      `upgrade-${upgrade.name.toLowerCase().replace(/\s+/g, "-")}`,
    )!;
    if (bank >= upgrade.cost) {
      button.removeAttribute("disabled");
    } else {
      button.setAttribute("disabled", "true");
    }
  });
}

// ====================================
//  GAME LOGIC
// ====================================
function incrementBank(value: number) {
  bank += value;
}

// ====================================
//  EVENT LISTENERS
// ====================================
mainButton.addEventListener("click", () => {
  frogSoundInstance.play();
  incrementBank(clickValue);
});

// Add funds produced by upgrades every second
setInterval(() => {
  incrementBank(autoClickValue);
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

  // Enable/disable upgrade buttons based on bank amount
  disableButtonCheck();

  // Update the counter display
  // Make sure values are fixed
  autoClickValue = +autoClickValue.toFixed(1);
  bank = +bank.toFixed(1);

  autoClickValueElement.innerText = autoClickValue.toString();
  counterElement.innerText = bank.toString();

  // Request the next frame
  requestAnimationFrame(update);
}

// Initial update call
update();

// Make sure there is a blank line at the end of the file for committing
