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

import heartImg from "./img/heart.png";

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

  <div class="upgrades" id="upgrade-container"></div>
`;

// ====================================
//  DOM ELEMENTS
// ====================================
const mainButton = document.getElementById("mainbutton")!;
const croaksPerSecondElement = document.getElementById("croaksPerSecond")!;
const counterElement = document.getElementById("counter")!;

// ====================================
//  UPGRADE BUTTONS
// ====================================
const container = document.getElementById("upgrade-container")!;

// Add a "sticky" header to the upgrade container
const title = document.createElement("div");
title.id = "upgrades-title";
title.textContent = "Upgrades";

const descContainer = document.createElement("div");
descContainer.id = "desc-container";

container.appendChild(title);
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
  container.appendChild(descContainer);

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

      // Play click effects
      button.classList.add("clicked");
      setTimeout(() => {
        button.classList.remove("clicked");
      }, 120);

      upgradeSoundInstance.play();
    }
  });

  // Add hover description
  button.addEventListener("mouseenter", () => {
    descContainer.innerHTML = upgrade.desc;
  });
  button.addEventListener("mouseleave", () => {
    descContainer.innerHTML = "...";
  });
});

// Automatically scroll to the top of the upgrades
container.scrollTop = 0;

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
  // Play click effect
  mainButton.classList.add("clicked");
  setTimeout(() => {
    mainButton.classList.remove("clicked");
  }, 120);

  // Spawn a heart above the frog
  const heart = document.createElement("img");
  heart.src = heartImg;
  heart.className = "floating-heart";

  const rect = mainButton.getBoundingClientRect();
  const heartX = rect.left + rect.width * (0.2 + Math.random() * 0.6);
  const heartY = rect.top + rect.height * 0.1;

  heart.style.left = heartX + "px";
  heart.style.top = heartY + "px";
  document.body.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 1000);

  // Play sound and increment croaks
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

// ====================================
//  LOCAL SAVE / LOAD SYSTEM
// ====================================
const SAVE_KEY = "frogfrenzy-save-v1";

interface SaveData {
  croaks: number;
  croaksPerSecond: number;
  upgrades: { count: number; cost: number }[];
}

// Save the current game state
function saveGame() {
  const saveData: SaveData = {
    croaks,
    croaksPerSecond,
    upgrades: availableUpgrades.map((u) => ({
      count: u.count,
      cost: u.cost,
    })),
  };

  localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}

// Load save into memory (if exists)
function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return;

  try {
    const data: SaveData = JSON.parse(raw);

    croaks = data.croaks ?? 0;
    croaksPerSecond = data.croaksPerSecond ?? 0;

    data.upgrades?.forEach((saved, i) => {
      if (!availableUpgrades[i]) return;
      availableUpgrades[i].count = saved.count ?? 0;
      availableUpgrades[i].cost = saved.cost ?? availableUpgrades[i].cost;

      // Update UI text for counts + costs
      const id = `upgrade-${
        availableUpgrades[i].name.toLowerCase().replace(/\s+/g, "-")
      }`;
      const button = document.getElementById(id);
      if (button) {
        const info = button.querySelector("span[id$='-info']");
        const count = button.querySelector("span[id$='-count']");

        if (info) {
          info.innerHTML = `(Cost: ${availableUpgrades[i].cost})<br>(+${
            availableUpgrades[i].rate
          } CpS)`;
        }
        if (count) count.textContent = `Owned: ${availableUpgrades[i].count}`;
      }
    });
  } catch (e) {
    console.warn("Failed to load save:", e);
  }
}

setInterval(saveGame, 5000);
addEventListener("beforeunload", saveGame);

// Load saved game state
loadGame();

// Initial update call
update();

// Make sure there is a blank line at the end of the file for committing
