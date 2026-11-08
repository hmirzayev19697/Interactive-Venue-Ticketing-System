const venueEl = document.getElementById("venue");
const ROW_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const STORAGE_KEY = "royalBlueCart";
const MAX_TICKETS = 8;

const legendEl = document.getElementById("legend");
const summaryEl = document.getElementById("seat-summary");
const detailsEl = document.getElementById("seat-details");
const addBtn = document.getElementById("add-to-cart");
const messageEl = document.getElementById("message");
const cartList = document.getElementById("cart-list");
const cartTotalEl = document.getElementById("cart-total");
const cartCountEl = document.getElementById("cart-count");
const navCartCountEl = document.getElementById("nav-cart-count");
const clearBtn = document.getElementById("clear-cart");

// all seats by their id, e.g. seats["GZ-A1"]
const seats = {};
let inspectedId = null;
let cart = [];

// the ticket that was just removed and where it was in the cart
let removed = null;
let removedTimer = null;

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

    seat.addEventListener("click", () => {
        // (bonus) after dragging the map the click should not select a seat
        if (!wasDragged) {
            inspectSeat(id);
        }
    });

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
    showMessage("");
    renderDetails();
}

// fills the Seat Details panel on the right
function renderDetails() {
    if (!inspectedId) {
        detailsEl.innerHTML = `<p class="empty">Click a seat on the map to see its details.</p>`;
        addBtn.disabled = true;
        return;
    }

    const seat = seats[inspectedId];
    const inCart = cart.includes(seat.id);
    let status = "Available";
    if (seat.sold) {
        status = "Unavailable";
    } else if (inCart) {
        status = "In your cart";
    }

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
    const cartFull = cart.length >= MAX_TICKETS;
    addBtn.disabled = seat.sold || inCart || cartFull;

    if (inCart) {
        addBtn.textContent = "Already in Cart";
    } else if (cartFull && !seat.sold) {
        addBtn.textContent = `Limit of ${MAX_TICKETS} tickets`;
    } else {
        addBtn.textContent = "Add to Cart";
    }
}

// small message under the Add to Cart button
function showMessage(text, type) {
    messageEl.textContent = text;
    messageEl.className = "message " + (type || "");
}

// adds the selected seat to the cart after a few checks
function addToCart() {
    const seat = seats[inspectedId];

    if (seat.sold) {
        showMessage("This seat is unavailable.", "error");
        return;
    }
    if (cart.includes(seat.id)) {
        showMessage("This seat is already in your cart.", "error");
        return;
    }

    cart.push(seat.id);
    removed = null;
    updateCart();
    showMessage("Ticket added to your cart.", "success");
}

function removeFromCart(id) {
    removed = { id: id, position: cart.indexOf(id) };
    cart = cart.filter(item => item !== id);
    updateCart();
    showMessage("");

    // the note disappears after 5 seconds
    clearTimeout(removedTimer);
    removedTimer = setTimeout(() => {
        removed = null;
        renderCart();
    }, 5000);
}

function clearCart() {
    if (confirm("Remove all tickets from your cart?")) {
        cart = [];
        removed = null;
        updateCart();
        showMessage("");
    }
}

// updates the seat colours on the map, the cart and the details panel
function updateCart() {
    for (const id in seats) {
        if (cart.includes(id)) {
            seats[id].el.classList.add("in-cart");
        } else {
            seats[id].el.classList.remove("in-cart");
        }
    }
    renderCart();
    renderDetails();
    saveCart();
}

// the cart is saved in localStorage so it stays after a refresh
function saveCart() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

function loadCart() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        cart = JSON.parse(saved);
    }
}

// the "... was removed" note shown where the ticket used to be
function createRemovedNote() {
    const seat = seats[removed.id];
    const note = document.createElement("li");
    note.className = "cart-removed";
    note.textContent = `${seat.section}, Row ${seat.row}, Seat ${seat.number} was removed`;
    return note;
}

// draws the list of tickets and the total price
function renderCart() {
    cartList.innerHTML = "";

    let total = 0;
    cart.forEach((id, position) => {
        if (removed && removed.position === position) {
            cartList.appendChild(createRemovedNote());
        }

        const seat = seats[id];
        total += seat.price;

        const item = document.createElement("li");
        item.className = "cart-item";
        item.innerHTML = `
            <button class="cart-seat">
                <strong>${seat.section}</strong>
                <span>Row ${seat.row}, Seat ${seat.number} - ${seat.category}</span>
            </button>
            <span class="cart-price">${formatPrice(seat.price)}</span>
            <button class="remove" title="Remove">x</button>
        `;
        item.querySelector(".remove").addEventListener("click", () => removeFromCart(id));
        item.querySelector(".cart-seat").addEventListener("click", () => inspectSeat(id));
        cartList.appendChild(item);
    });

    if (removed && removed.position >= cart.length) {
        cartList.appendChild(createRemovedNote());
    }

    if (cart.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty";
        empty.textContent = "Your cart is empty.";
        cartList.appendChild(empty);
    }

    cartTotalEl.textContent = formatPrice(total);
    cartCountEl.textContent = cart.length;
    navCartCountEl.textContent = cart.length;
    clearBtn.disabled = cart.length === 0;
}

addBtn.addEventListener("click", addToCart);

clearBtn.addEventListener("click", clearCart);

renderLegend();
renderSummary();
renderVenue();
loadCart();
updateCart();
startView();
