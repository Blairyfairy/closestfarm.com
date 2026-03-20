// ----------------------
// Data file for ClosestFarm
// ----------------------

// Famous airports (zoom anchors)
const airports = [
  { name: "LAX - Los Angeles", lat: 33.9416, lon: -118.4085 },
  { name: "JFK - New York", lat: 40.6413, lon: -73.7781 },
  { name: "ORD - Chicago", lat: 41.9742, lon: -87.9073 },
  { name: "DFW - Dallas", lat: 32.8998, lon: -97.0403 },
  { name: "LAS - Las Vegas", lat: 36.0840, lon: -115.1537 },
  { name: "ATL - Atlanta", lat: 33.6407, lon: -84.4277 },
  { name: "SFO - San Francisco", lat: 37.6213, lon: -122.3790 },
  { name: "MIA - Miami", lat: 25.7959, lon: -80.2871 },
  { name: "SEA - Seattle", lat: 47.4502, lon: -122.3088 },
  { name: "BOS - Boston", lat: 42.3656, lon: -71.0096 }
];

// Sample fallback market data per city (lat/lon offsets)
const fallbackMarkets = [
  { name: "Community Farmers Market", offsetLat: 0.02, offsetLon: 0.02 },
  { name: "Local Organic Farm Stand", offsetLat: -0.015, offsetLon: 0.01 },
  { name: "Fresh Produce Market", offsetLat: 0.01, offsetLon: -0.02 },
  { name: "Downtown Fresh Market", offsetLat: 0.018, offsetLon: -0.015 },
  { name: "Neighborhood Organic Market", offsetLat: -0.012, offsetLon: 0.018 },
  { name: "Weekend Farmers Market", offsetLat: 0.025, offsetLon: -0.01 },
  { name: "City Green Market", offsetLat: -0.02, offsetLon: -0.02 }
];

// Optional: Add more cities with coordinates for direct search markers
const cities = [
  { name: "Los Angeles, USA", lat: 34.0522, lon: -118.2437 },
  { name: "New York, USA", lat: 40.7128, lon: -74.0060 },
  { name: "Chicago, USA", lat: 41.8781, lon: -87.6298 },
  { name: "Dallas, USA", lat: 32.7767, lon: -96.7970 },
  { name: "Las Vegas, USA", lat: 36.1699, lon: -115.1398 },
  { name: "Atlanta, USA", lat: 33.7490, lon: -84.3880 },
  { name: "San Francisco, USA", lat: 37.7749, lon: -122.4194 },
  { name: "Miami, USA", lat: 25.7617, lon: -80.1918 },
  { name: "Seattle, USA", lat: 47.6062, lon: -122.3321 },
  { name: "Boston, USA", lat: 42.3601, lon: -71.0589 }
];
