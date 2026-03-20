// ----------------------
// Main JS for ClosestFarm
// ----------------------

// Make sure to include data.js before this file
let map;
let markers = [];
let airportMarkers = [];

// Initialize map
function initMap() {
    map = L.map('map').setView([39.5, -98.35], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    addAirportMarkers();

    // Try user location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            map.setView([lat, lon], 12);
            findMarkets(lat, lon);
        });
    }
}

// Add airport markers (zoom anchors)
function addAirportMarkers() {
    airports.forEach(airport => {
        const marker = L.marker([airport.lat, airport.lon]).addTo(map);
        marker.bindPopup(`<b>${airport.name}</b><br>Click to explore markets`);
        marker.on('click', () => {
            map.setView([airport.lat, airport.lon], 12);
            findMarkets(airport.lat, airport.lon);
        });
        airportMarkers.push(marker);
    });
}

// Search location via input
async function searchLocation() {
    const query = document.getElementById('locationInput').value;
    if (!query) return;

    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (!data.length) return alert("Location not found");

        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);

        map.setView([lat, lon], 12);
        findMarkets(lat, lon);
    } catch (err) {
        alert("Failed to fetch location");
    }
}

// Fetch farmers markets using Overpass API
async function findMarkets(lat, lon) {
    // Clear old markers
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    const query = `
    [out:json][timeout:25];
    (
      node["amenity"="marketplace"](around:8000,${lat},${lon});
      node["shop"="farm"](around:8000,${lat},${lon});
      node["shop"="greengrocer"](around:8000,${lat},${lon});
    );
    out;
    `;

    try {
        const res = await fetch("https://overpass-api.de/api/interpreter", { method: "POST", body: query });
        const data = await res.json();

        if (!data.elements.length) {
            showFallbackMarkets(lat, lon);
            return;
        }

        data.elements.forEach(place => {
            const marker = L.circleMarker([place.lat, place.lon], {
                radius: 8,
                color: "#14532d",
                fillColor: "#22c55e",
                fillOpacity: 1
            }).addTo(map);

            const name = place.tags.name || "Local Market";
            marker.bindPopup(`<b>${name}</b>`);

            marker.on('click', () => updateInfo(`<h2>${name}</h2><p>Latitude: ${place.lat.toFixed(4)} | Longitude: ${place.lon.toFixed(4)}</p>`));

            markers.push(marker);
        });

        updateInfo(`🌱 Found ${data.elements.length} markets nearby`);
    } catch (err) {
        showFallbackMarkets(lat, lon);
    }
}

// Fallback markets using data.js offsets
function showFallbackMarkets(lat, lon) {
    fallbackMarkets.forEach(place => {
        const marker = L.circleMarker([lat + place.offsetLat, lon + place.offsetLon], {
            radius: 8,
            color: "#14532d",
            fillColor: "#4ade80",
            fillOpacity: 1
        }).addTo(map);

        marker.bindPopup(`<b>${place.name}</b><br>(Estimated)`);
        marker.on('click', () => updateInfo(`<h2>${place.name}</h2><p>Estimated market location</p>`));

        markers.push(marker);
    });

    updateInfo("⚠️ Showing estimated markets (limited data area)");
}

// Update info card
function updateInfo(content) {
    const info = document.getElementById('info');
    info.innerHTML = content;
    info.classList.add('show');
}

// Event listeners
document.getElementById('searchBtn').addEventListener('click', searchLocation);
document.getElementById('locationInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') searchLocation();
});

// Initialize
window.onload = initMap;
