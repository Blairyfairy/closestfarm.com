let map;
let markers = [];

// Initialize map
function initMap() {
    map = L.map('map').setView([39.5, -98.35], 4); // USA center

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
    }).addTo(map);

    // Auto detect user location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            map.setView([lat, lon], 12);
            findMarkets(lat, lon);
        });
    }
}

// Search by city
async function searchLocation() {
    const query = document.getElementById('locationInput').value;

    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
    const data = await res.json();

    if (data.length === 0) return alert("Location not found");

    const lat = data[0].lat;
    const lon = data[0].lon;

    map.setView([lat, lon], 12);
    findMarkets(lat, lon);
}

// Fetch farmers markets (Overpass API - FREE)
async function findMarkets(lat, lon) {

    // Clear old markers
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    const query = `
    [out:json];
    node["amenity"="marketplace"](around:5000,${lat},${lon});
    out;
    `;

    const url = "https://overpass-api.de/api/interpreter";

    const res = await fetch(url, {
        method: "POST",
        body: query
    });

    const data = await res.json();

    if (!data.elements.length) {
        document.getElementById('info').innerHTML = "No markets found nearby.";
        document.getElementById('info').classList.add('show');
        return;
    }

    data.elements.forEach(place => {
        const marker = L.circleMarker([place.lat, place.lon], {
            radius: 8,
            color: "#14532d",
            fillColor: "#22c55e",
            fillOpacity: 1
        }).addTo(map);

        const name = place.tags.name || "Farmers Market";

        marker.bindPopup(`<b>${name}</b><br>Local marketplace`);

        markers.push(marker);
    });

    document.getElementById('info').innerHTML =
        `🌱 Found ${data.elements.length} farmers markets nearby`;
    document.getElementById('info').classList.add('show');
}

window.onload = initMap;
