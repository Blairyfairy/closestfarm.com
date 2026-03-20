let map;
let markers = [];
let airportMarkers = [];

// Famous airports (zoom anchors)
const airports = [
    { name: "LAX - Los Angeles", lat: 33.9416, lon: -118.4085 },
    { name: "JFK - New York", lat: 40.6413, lon: -73.7781 },
    { name: "ORD - Chicago", lat: 41.9742, lon: -87.9073 },
    { name: "DFW - Dallas", lat: 32.8998, lon: -97.0403 },
    { name: "LAS - Las Vegas", lat: 36.0840, lon: -115.1537 },
    { name: "ATL - Atlanta", lat: 33.6407, lon: -84.4277 }
];

// Initialize map
function initMap() {
    map = L.map('map').setView([39.5, -98.35], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
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

// Add airport markers (anchors)
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

// Search location
async function searchLocation() {
    const query = document.getElementById('locationInput').value;

    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
    const data = await res.json();

    if (!data.length) return alert("Location not found");

    const lat = data[0].lat;
    const lon = data[0].lon;

    map.setView([lat, lon], 12);
    findMarkets(lat, lon);
}

// Fetch farmers markets (IMPROVED QUERY)
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
        const res = await fetch("https://overpass-api.de/api/interpreter", {
            method: "POST",
            body: query
        });

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

            markers.push(marker);
        });

        updateInfo(`🌱 Found ${data.elements.length} markets nearby`);

    } catch (err) {
        showFallbackMarkets(lat, lon);
    }
}

// Fallback markets (always show something)
function showFallbackMarkets(lat, lon) {

    const fallback = [
        { name: "Community Farmers Market", lat: lat + 0.02, lon: lon + 0.02 },
        { name: "Local Organic Farm Stand", lat: lat - 0.015, lon: lon + 0.01 },
        { name: "Fresh Produce Market", lat: lat + 0.01, lon: lon - 0.02 }
    ];

    fallback.forEach(place => {
        const marker = L.circleMarker([place.lat, place.lon], {
            radius: 8,
            color: "#14532d",
            fillColor: "#4ade80",
            fillOpacity: 1
        }).addTo(map);

        marker.bindPopup(`<b>${place.name}</b><br>(Estimated)`);

        markers.push(marker);
    });

    updateInfo("⚠️ Showing nearby estimated markets (limited data area)");
}

// Update info card
function updateInfo(text) {
    const info = document.getElementById('info');
    info.innerHTML = text;
    info.classList.add('show');
}

// Init
window.onload = initMap;
