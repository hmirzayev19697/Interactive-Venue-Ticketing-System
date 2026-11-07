const viewport = document.getElementById("map-viewport");
const mapContent = document.getElementById("venue");
const zoomLevelEl = document.getElementById("zoom-level");
const zoomInBtn = document.getElementById("zoom-in");
const zoomOutBtn = document.getElementById("zoom-out");

const MIN_SCALE = 0.25;
const MAX_SCALE = 2.5;
const ZOOM_STEP = 0.25;
const MOVE_STEP = 80;

let scale = 1;
let moveX = 0;
let moveY = 0;

// moves and zooms the map with a CSS transform
function applyView() {
    // the map can move until its edge reaches the middle of the box,
    // so every part of it can be reached, even on a small phone screen
    const halfWidth = mapContent.offsetWidth / 2;
    const halfHeight = mapContent.offsetHeight / 2;
    const minX = viewport.clientWidth / 2 - halfWidth * scale - halfWidth;
    const maxX = viewport.clientWidth / 2 + halfWidth * scale - halfWidth;
    const minY = viewport.clientHeight / 2 - halfHeight * scale - halfHeight;
    const maxY = viewport.clientHeight / 2 + halfHeight * scale - halfHeight;
    if (moveX < minX) {
        moveX = minX;
    }
    if (moveX > maxX) {
        moveX = maxX;
    }
    if (moveY < minY) {
        moveY = minY;
    }
    if (moveY > maxY) {
        moveY = maxY;
    }

    mapContent.style.transform = `translate(${moveX}px, ${moveY}px) scale(${scale})`;
    zoomLevelEl.textContent = Math.round(scale * 100) + "%";
    zoomInBtn.disabled = scale >= MAX_SCALE;
    zoomOutBtn.disabled = scale <= MIN_SCALE;
}

function zoom(amount) {
    scale = scale + amount;
    if (scale > MAX_SCALE) {
        scale = MAX_SCALE;
    }
    if (scale < MIN_SCALE) {
        scale = MIN_SCALE;
    }
    applyView();
}

function move(x, y) {
    moveX = moveX + x;
    moveY = moveY + y;
    applyView();
}

// makes the whole map fit in the box and puts it in the middle
function resetView() {
    const fitWidth = viewport.clientWidth / mapContent.offsetWidth;
    const fitHeight = viewport.clientHeight / mapContent.offsetHeight;
    scale = Math.min(fitWidth, fitHeight, 1) * 0.95;
    if (scale < MIN_SCALE) {
        scale = MIN_SCALE;
    }
    moveX = (viewport.clientWidth - mapContent.offsetWidth) / 2;
    moveY = (viewport.clientHeight - mapContent.offsetHeight) / 2;
    applyView();
}

// the map starts at normal size, showing the stage and the front rows
function startView() {
    scale = 1;
    moveX = (viewport.clientWidth - mapContent.offsetWidth) / 2;
    moveY = 0;
    applyView();
}

zoomInBtn.addEventListener("click", () => zoom(ZOOM_STEP));
zoomOutBtn.addEventListener("click", () => zoom(-ZOOM_STEP));
document.getElementById("move-up").addEventListener("click", () => move(0, MOVE_STEP));
document.getElementById("move-down").addEventListener("click", () => move(0, -MOVE_STEP));
document.getElementById("move-left").addEventListener("click", () => move(MOVE_STEP, 0));
document.getElementById("move-right").addEventListener("click", () => move(-MOVE_STEP, 0));
document.getElementById("reset-view").addEventListener("click", resetView);
