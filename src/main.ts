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

import upgrade2Img from "./img/embryo.png";
import upgrade4Img from "./img/froglet.png";
import upgrade1Img from "./img/frogspawn.png";
import upgrade5Img from "./img/kingfrog.png";
import upgrade3Img from "./img/tadpole.png";

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

  <div class="upgradecontainer">
  <button id="upgrade1" class = "upgradebutton">Frogspawn<br><img src="${upgrade1Img}" class="upgradeicon" /><br>
    <span id="upgrade1Info">(Cost: ${availableUpgrades[0].cost})<br>
    (+ ${availableUpgrades[0].rate} CpS)</span><br><br>
    <span id="upgradeCount1">Owned: ${
  availableUpgrades[0].count
}</span></button>

  <button id="upgrade2" class = "upgradebutton">Embryo<br><img src="${upgrade2Img}" class="upgradeicon" /><br>
    <span id="upgrade2Info">(Cost: ${availableUpgrades[1].cost})<br>
    (+ ${availableUpgrades[1].rate} CpS)</span><br><br>
    <span id="upgradeCount2">Owned: ${
  availableUpgrades[1].count
}</span></button>

  <button id="upgrade3" class = "upgradebutton">Tadpole<br><img src="${upgrade3Img}" class="upgradeicon" /><br>
    <span id="upgrade3Info">(Cost: ${availableUpgrades[2].cost})<br>
    (+ ${availableUpgrades[2].rate} CpS)</span><br><br>
    <span id="upgradeCount3">Owned: ${
  availableUpgrades[2].count
}</span></button>

  <button id="upgrade4" class = "upgradebutton">Froglet<br><img src="${upgrade4Img}" class="upgradeicon" /><br>
    <span id="upgrade4Info">(Cost: ${availableUpgrades[3].cost})<br>
    (+ ${availableUpgrades[3].rate} CpS)</span><br><br>
    <span id="upgradeCount4">Owned: ${
  availableUpgrades[3].count
}</span></button>

  <button id="upgrade5" class = "upgradebutton">King Frog<br><img src="${upgrade5Img}" class="upgradeicon" /><br>
      <span id="upgrade5Info">(Cost: ${availableUpgrades[4].cost})<br>
      (+ ${availableUpgrades[4].rate} CpS)</span><br><br>
      <span id="upgradeCount5">Owned: ${
  availableUpgrades[4].count
}</span></button>
  </div>

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
//  UPGRADE BUTTONS
// ====================================
availableUpgrades.forEach((upgrade, index) => {
  const button = document.getElementById(`upgrade${index + 1}`)!;
  const info = document.getElementById(`upgrade${index + 1}Info`)!;
  const countElement = document.getElementById(`upgradeCount${index + 1}`)!;

  button.addEventListener("click", () => {
    if (bank >= upgrade.cost) {
      bank -= upgrade.cost;
      autoClickValue += upgrade.rate;
      countElement.innerText = `Owned: ${++upgrade.count}`;
      upgrade.cost = +(upgrade.cost * 1.15).toFixed(1); // Increase cost by 15%
      upgradeSoundInstance.play();
      info.innerText = `(Cost: ${upgrade.cost})\n(+ ${upgrade.rate} CpS)`;
    }
  });
});

// ====================================
//  HOVER DESCRIPTIONS
// ====================================
availableUpgrades.forEach((upgrade, index) => {
  const button = document.getElementById(`upgrade${index + 1}`)!;

  button.addEventListener("mouseenter", () => {
    descElement.innerText = upgrade.desc;
  });

  button.addEventListener("mouseleave", () => {
    descElement.innerText = "...";
  });
});

// Enable or disable upgrade buttons based on bank amount
function disableButtonCheck() {
  availableUpgrades.forEach((upgrade, index) => {
    const button = document.getElementById(`upgrade${index + 1}`)!;
    if (bank >= upgrade.cost) {
      button.removeAttribute("disabled");
    } else {
      button.setAttribute("disabled", "true");
    }
  });
}

// Update the counter display every frame (max 60fps)
let previousTime = 0;

// ====================================
//  RENDER LOOP
// ====================================
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

  availableUpgrades.forEach((upgrade, index) => {
    const countElement = document.getElementById(`upgradeCount${index + 1}`)!;
    countElement.innerText = `Owned: ${upgrade.count}`;
  });

  // Request the next frame
  requestAnimationFrame(update);
}

// Initial update call
update();

// Make sure there is a blank line at the end of the file for committing
