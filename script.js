const venueEl = document.getElementById("venue");
const ROW_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const legendEl = document.getElementById("legend");
const summaryEl = document.getElementById("seat-summary");

// turns a number into a price, e.g. 450 AZN
function formatPrice(amount) {
    return amount + " " + venue.currency;
}

// shows every price category with its colour under the map
function renderLegend() {
    for (const key in venue.categories) {
        const category = venue.categories[key];
        const item = document.createElement("li");
        item.innerHTML = `
            <span class="color-box ${key}"></span>
            ${category.name} ${formatPrice(category.price)}
        `;
        legendEl.appendChild(item);
    }
}

// counts all seats and shows the total under the event title
function renderSummary() {
    let total = 0;
    venue.sections.forEach(section => {
        total += section.rows * section.seats;
    });
    summaryEl.textContent = `${total} seats · ${venue.sections.length} sections`;
}

// builds the whole venue map from the data in data.js
function renderVenue() {
    const stage = document.createElement("div");
    stage.className = "stage";
    stage.textContent = "Stage";
    stage.style.gridArea = "stage";
    venueEl.appendChild(stage);

    venue.sections.forEach(section => {
        venueEl.appendChild(createSection(section));
    });
}

// one section with its title, rows and seats
function createSection(section) {
    const category = venue.categories[section.category];
    const sectionEl = document.createElement("div");
    sectionEl.className = "section";
    if (section.side) {
        sectionEl.classList.add(section.side);
    }
    sectionEl.style.gridArea = section.id;

    const title = document.createElement("h3");
    title.textContent = `${section.name} - ${formatPrice(category.price)}`;
    sectionEl.appendChild(title);

    for (let r = 0; r < section.rows; r++) {
        const row = document.createElement("div");
        row.className = "row";
        const letter = ROW_LETTERS[r];

        for (let number = 1; number <= section.seats; number++) {
            row.appendChild(createSeat(section, letter, number));
        }
        sectionEl.appendChild(row);
    }
    return sectionEl;
}

// creates one seat button and remembers its info in the seats object
function createSeat(section, letter, number) {
    const seat = document.createElement("button");
    seat.className = "seat " + section.category;
    seat.dataset.id = `${section.id}-${letter}${number}`;
    return seat;
}

renderLegend();
renderSummary();
renderVenue();
