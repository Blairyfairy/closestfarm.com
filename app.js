let map;
let markers = [];
let markets = [
  { name:"Downtown Market", lat:40.7128, lng:-74.006, photos:[] },
  { name:"Sunset Farmers", lat:34.0522, lng:-118.2437, photos:[] },
  { name:"Greenfield Market", lat:41.8781, lng:-87.6298, photos:[] },
  { name:"Veggie Heaven", lat:36.1699, lng:-115.1398, photos:[] }
];

function initMap(){
  map = L.map('map').setView([37.0902, -95.7129],4);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'&copy; OpenStreetMap contributors'
  }).addTo(map);

  markets.forEach((m,i)=>{
    setTimeout(()=>{
      const marker = L.circleMarker([m.lat,m.lng],{
        radius:10,
        color:'#fff',
        fillColor:'#66bb6a',
        fillOpacity:1,
        weight:2
      }).addTo(map);

      marker.on('click', ()=> showMarket(m));
      markers.push(marker);
    }, i*100);
  });
}

function showMarket(market){
  const card = document.getElementById('infoCard');
  document.getElementById('marketName').innerText = market.name;

  const photosDiv = document.getElementById('marketPhotos');
  photosDiv.innerHTML = '';
  market.photos.forEach(p=>{
    const img = document.createElement('img');
    img.src = p;
    photosDiv.appendChild(img);
  });

  card.classList.add('show');
}

// SEARCH
document.getElementById('searchBtn').addEventListener('click', ()=>{
  const term = document.getElementById('marketSearch').value.toLowerCase();
  const market = markets.find(m=> m.name.toLowerCase().includes(term));
  if(market){
    map.flyTo([market.lat, market.lng],6);
    showMarket(market);
  } else alert("Market not found!");
});

// CHECK IN
document.getElementById('checkInBtn').addEventListener('click', ()=>{
  const url = prompt("Paste a photo URL to upload (optional):");
  if(url){
    const marketName = document.getElementById('marketName').innerText;
    const market = markets.find(m=>m.name===marketName);
    market.photos.push(url);
    showMarket(market);
  }
});

// LOGIN BUTTON (mock)
document.getElementById('loginBtn').addEventListener('click', ()=>{
  alert("Login feature placeholder (SSO can be added later).");
});

// INITIALIZE
window.onload = initMap;
