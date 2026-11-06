const venueEl = document.getElementById("venue");
const ROW_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const legendEl = document.getElementById("legend");
const summaryEl = document.getElementById("seat-summary");
const detailsEl = document.getElementById("seat-details");

// all seats by their id, e.g. seats["GZ-A1"]
const seats = {};
let inspectedId = null;

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
    const available = total - venue.sold.length;
    summaryEl.textContent = `${total} seats - ${available} available`;
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
        row.appendChild(createRowLabel(letter));

        for (let number = 1; number <= section.seats; number++) {
            row.appendChild(createSeat(section, letter, number));

            if (section.aisles && section.aisles.includes(number)) {
                const aisle = document.createElement("span");
                aisle.className = "aisle";
                row.appendChild(aisle);
            }
        }
        row.appendChild(createRowLabel(letter));
        sectionEl.appendChild(row);
    }
    return sectionEl;
}

// the letter shown at the start and end of each row
function createRowLabel(letter) {
    const label = document.createElement("span");
    label.className = "row-label";
    label.textContent = letter;
    return label;
}

// creates one seat button and remembers its info in the seats object
function createSeat(section, letter, number) {
    const id = `${section.id}-${letter}${number}`;
    const seat = document.createElement("button");
    seat.className = "seat " + section.category;
    seat.dataset.id = id;

    const category = venue.categories[section.category];
    const sold = venue.sold.includes(id);
    if (sold) {
        seat.classList.add("sold");
    }

    seat.addEventListener("click", () => inspectSeat(id));

    seats[id] = {
        id: id,
        section: section.name,
        row: letter,
        number: number,
        category: category.name,
        price: category.price,
        sold: sold,
        el: seat
    };
    return seat;
}

// called when a seat is clicked, highlights it and shows its details
function inspectSeat(id) {
    if (inspectedId) {
        seats[inspectedId].el.classList.remove("inspected");
    }
    inspectedId = id;
    seats[id].el.classList.add("inspected");
    renderDetails();
}

// fills the Seat Details panel on the right
function renderDetails() {
    if (!inspectedId) {
        detailsEl.innerHTML = `<p class="empty">Click a seat on the map to see its details.</p>`;
        return;
    }

    const seat = seats[inspectedId];
    const status = seat.sold ? "Unavailable" : "Available";

    detailsEl.innerHTML = `
        <dl class="details">
            <dt>Section</dt><dd>${seat.section}</dd>
            <dt>Row</dt><dd>${seat.row}</dd>
            <dt>Seat</dt><dd>${seat.number}</dd>
            <dt>Category</dt><dd>${seat.category}</dd>
            <dt>Status</dt><dd class="status ${seat.sold ? "is-sold" : ""}">${status}</dd>
        </dl>
        <p class="price">${formatPrice(seat.price)}</p>
    `;
}

renderLegend();
renderSummary();
renderVenue();
renderDetails();
