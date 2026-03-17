let map;
let markers = [];
let username = "";

// Sample farmers markets
const markets = [
  {name:"Green Valley Farm", lat:40.7128, lng:-74.006},
  {name:"Sunnydale Market", lat:34.0522, lng:-118.2437},
  {name:"Riverfront Farmers", lat:41.8781, lng:-87.6298},
  {name:"Oceanview Market", lat:36.1699, lng:-115.1398},
  {name:"London Fresh Farm", lat:51.5074, lng:-0.1278},
  {name:"Paris Market", lat:48.8566, lng:2.3522},
];

// --- Initialize Map ---
function initMap(){
  map = L.map('map').setView([20,0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Add markers
  markets.forEach((m,i)=>{
    setTimeout(()=>{
      const marker = L.circleMarker([m.lat,m.lng],{
        radius:8,
        color:'#fff',
        fillColor:'#34b87a',
        fillOpacity:1,
        weight:2
      }).addTo(map);
      markers.push(marker);
      marker.on('click',()=> showMarketInfo(m));
    }, i*100);
  });
}

// --- Show Market Info ---
function showMarketInfo(market){
  const card = document.getElementById('marketInfo');
  document.getElementById('marketName').innerText = market.name;
  card.classList.add('show');
  loadGallery(market);
}

// --- Gallery & Storage ---
function loadGallery(market){
  const gallery = document.getElementById('photoGallery');
  gallery.innerHTML = "";
  const photos = JSON.parse(localStorage.getItem(market.name)) || [];
  photos.forEach(src=>{
    const img = document.createElement('img');
    img.src = src;
    gallery.appendChild(img);
  });
}

document.getElementById('photoUpload').addEventListener('change', function(){
  const files = Array.from(this.files);
  const marketName = document.getElementById('marketName').innerText;
  const stored = JSON.parse(localStorage.getItem(marketName)) || [];
  files.forEach(f=>{
    const reader = new FileReader();
    reader.onload = function(e){
      stored.push(e.target.result);
      localStorage.setItem(marketName, JSON.stringify(stored));
      loadGallery({name:marketName});
    }
    reader.readAsDataURL(f);
  });
});

// --- Check In ---
document.getElementById('checkInBtn').addEventListener('click', ()=>{
  const marketName = document.getElementById('marketName').innerText;
  const checkIns = JSON.parse(localStorage.getItem('checkIns')) || [];
  checkIns.push({market:marketName,user:username||'Anonymous',time:Date.now()});
  localStorage.setItem('checkIns',JSON.stringify(checkIns));
  alert(`Checked in at ${marketName}!`);
});

// --- Login ---
document.getElementById('loginBtn').addEventListener('click', ()=>{
  username = document.getElementById('usernameInput').value || 'Anonymous';
  document.getElementById('welcomeMsg').innerText = `Welcome, ${username}!`;
  localStorage.setItem('username', username);
});

// --- Search ---
document.getElementById('marketSearch').addEventListener('input', function(){
  const query = this.value.toLowerCase();
  markers.forEach((marker,i)=>{
    const mName = markets[i].name.toLowerCase();
    if(mName.includes(query)) marker.addTo(map);
    else map.removeLayer(marker);
  });
});

// --- Social Sharing ---
function shareURL(platform){
  const marketName = document.getElementById('marketName').innerText;
  const text = encodeURIComponent(`I just checked in at ${marketName}! #ClosestFarm`);
  let url="";
  if(platform==='FB') url = `https://www.facebook.com/sharer/sharer.php?u=${text}`;
  if(platform==='TW') url = `https://twitter.com/intent/tweet?text=${text}`;
  if(platform==='WA') url = `https://wa.me/?text=${text}`;
  if(platform==='TT') alert("TikTok sharing: copy & post manually due to no API.");
  if(url) window.open(url,'_blank');
}

document.getElementById('shareFB').addEventListener('click', ()=>shareURL('FB'));
document.getElementById('shareTW').addEventListener('click', ()=>shareURL('TW'));
document.getElementById('shareWA').addEventListener('click', ()=>shareURL('WA'));
document.getElementById('shareTT').addEventListener('click', ()=>shareURL('TT'));

// --- Init ---
window.onload = ()=>{
  initMap();
  const savedName = localStorage.getItem('username');
  if(savedName){
    username = savedName;
    document.getElementById('welcomeMsg').innerText = `Welcome, ${username}!`;
  }
};
