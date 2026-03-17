// ClosestFarm App
let map;
let markers = [];
let currentUser = '';
let selectedMarket = null;

// Sample Markets
const markets = [
  { name:"Downtown Farmers Market", lat:40.7128, lng:-74.006 },
  { name:"LA Farmer's Hub", lat:34.0522, lng:-118.2437 },
  { name:"Chicago Central Market", lat:41.8781, lng:-87.6298 },
  { name:"Vegas Fresh Market", lat:36.1699, lng:-115.1398 },
  { name:"London Green Market", lat:51.5074, lng:-0.1278 },
  { name:"Tokyo Organic Market", lat:35.6762, lng:139.6503 }
];

// Initialize Map
function initMap(){
  map = L.map('map').setView([20,0],2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'&copy; OpenStreetMap contributors'
  }).addTo(map);

  markets.forEach((m,i)=>{
    const marker = L.circleMarker([m.lat,m.lng],{
      radius:8,
      color:'#fff',
      fillColor:'#34c759',
      fillOpacity:1,
      weight:2
    }).addTo(map);

    marker.on('click',()=>showMarket(m));
    markers.push(marker);
  });
}

// Show Market Info
function showMarket(market){
  selectedMarket = market;
  document.getElementById('marketName').textContent = market.name;

  // Load photos from LocalStorage
  const storedPhotos = JSON.parse(localStorage.getItem('photos_'+market.name))||[];
  const gallery = document.getElementById('photoGallery');
  gallery.innerHTML='';
  storedPhotos.forEach(src=>{
    const img = document.createElement('img');
    img.src=src;
    gallery.appendChild(img);
  });

  // Display badges if logged in
  const badgesDiv = document.getElementById('badges');
  const badgeList = JSON.parse(localStorage.getItem('badges_'+currentUser))||[];
  badgesDiv.textContent = badgeList.join(', ');

  document.getElementById('marketInfo').classList.add('show');
}

// Login / Username
document.getElementById('loginBtn').addEventListener('click',()=>{
  const input = document.getElementById('usernameInput').value.trim();
  currentUser = input || 'Guest';
  document.getElementById('welcomeMsg').textContent = 'Welcome, '+currentUser;
  localStorage.setItem('lastUser',currentUser);
});

// Photo Upload
document.getElementById('photoUpload').addEventListener('change', e=>{
  if(!selectedMarket) return;
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = ()=>{
      const src = reader.result;
      const photosKey = 'photos_'+selectedMarket.name;
      const existing = JSON.parse(localStorage.getItem(photosKey))||[];
      existing.push(src);
      localStorage.setItem(photosKey,JSON.stringify(existing));
      showMarket(selectedMarket);
    }
    reader.readAsDataURL(file);
  }
});

// Check-In
document.getElementById('checkInBtn').addEventListener('click',()=>{
  if(!selectedMarket) return;
  const badgeKey = 'badges_'+currentUser;
  const badges = JSON.parse(localStorage.getItem(badgeKey))||[];
  const newBadge = 'Checked in at '+selectedMarket.name;
  badges.push(newBadge);
  localStorage.setItem(badgeKey,JSON.stringify(badges));
  showMarket(selectedMarket);
});

// Social Share
function shareURL(platform){
  if(!selectedMarket) return;
  const url = encodeURIComponent('https://closestfarm.com');
  const text = encodeURIComponent(`I visited ${selectedMarket.name} 🌱 #ClosestFarm`);
  let shareLink='';
  if(platform==='FB') shareLink=`https://www.facebook.com/sharer/sharer.php?u=${url}`;
  if(platform==='TW') shareLink=`https://twitter.com/intent/tweet?text=${text}&url=${url}`;
  if(platform==='WA') shareLink=`https://api.whatsapp.com/send?text=${text} ${url}`;
  if(platform==='TT') shareLink=`https://www.tiktok.com/upload?text=${text}`;
  window.open(shareLink,'_blank');
}

document.getElementById('shareFB').addEventListener('click',()=>shareURL('FB'));
document.getElementById('shareTW').addEventListener('click',()=>shareURL('TW'));
document.getElementById('shareWA').addEventListener('click',()=>shareURL('WA'));
document.getElementById('shareTT').addEventListener('click',()=>shareURL('TT'));

// Market Search
document.getElementById('marketSearch').addEventListener('input', e=>{
  const val = e.target.value.toLowerCase();
  markers.forEach((m,i)=>{
    const marketName = markets[i].name.toLowerCase();
    if(marketName.includes(val)) m.addTo(map);
    else map.removeLayer(m);
  });
});

// Initialize
window.onload=()=>{
  currentUser = localStorage.getItem('lastUser')||'Guest';
  if(currentUser!=='Guest') document.getElementById('welcomeMsg').textContent='Welcome, '+currentUser;
  initMap();
};
