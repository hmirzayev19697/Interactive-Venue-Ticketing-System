const legendEl = document.getElementById("legend");
const summaryEl = document.getElementById("seat-summary");

// shows every price category with its colour under the map
function renderLegend() {
    for (const key in venue.categories) {
        const category = venue.categories[key];
        const item = document.createElement("li");
        item.innerHTML = `
            <span class="color-box ${key}"></span>
            ${category.name} <strong>${category.price} ${venue.currency}</strong>
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

renderLegend();
renderSummary();
