// ClosestFarm.com Demo - Fully Static, No API Keys

let map;
let markers = [];
let currentUser = null;

// Sample Farmers Markets
const markets = [
  {id:1, name:"Downtown Farmers Market", lat:40.7128, lng:-74.006, city:"New York"},
  {id:2, name:"LA Green Market", lat:34.0522, lng:-118.2437, city:"Los Angeles"},
  {id:3, name:"Chicago Fresh Market", lat:41.8781, lng:-87.6298, city:"Chicago"},
  {id:4, name:"Vegas Local Market", lat:36.1699, lng:-115.1398, city:"Las Vegas"},
  {id:5, name:"London Organic Market", lat:51.5074, lng:-0.1278, city:"London"}
];

// Load users from localStorage
let users = JSON.parse(localStorage.getItem("closestfarm_users")) || {};
let checkins = JSON.parse(localStorage.getItem("closestfarm_checkins")) || {};
let photos = JSON.parse(localStorage.getItem("closestfarm_photos")) || {};

// ----------------------
// Initialize Map
function initMap(){
  map = L.map('map').setView([20,0],2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'&copy; OpenStreetMap contributors'
  }).addTo(map);

  markets.forEach((market)=>{
    const marker = L.marker([market.lat, market.lng]).addTo(map);
    marker.on('click',()=>showMarketInfo(market));
    markers.push(marker);
  });
}

// ----------------------
// Show Market Info Panel
function showMarketInfo(market){
  const info = document.getElementById('marketInfo');
  info.innerHTML = `
    <h2>${market.name}</h2>
    <p>${market.city}</p>
    <p>Check-ins: ${checkins[market.id]?.length||0}</p>
    <div id="marketPhotos"></div>
    ${currentUser?`<input type="file" id="photoInput"><button id="uploadPhotoBtn">Upload Photo</button><button id="checkinBtn">Check-in</button>`:"<p>Login to upload/check-in</p>"}
    <p>Share:
      <button id="shareTwitter">Twitter</button>
      <button id="shareFB">Facebook</button>
      <button id="shareLinkedIn">LinkedIn</button>
      <button id="shareWhatsApp">WhatsApp</button>
    </p>
  `;
  info.classList.add('show');

  // Load photos
  const photosDiv = document.getElementById('marketPhotos');
  const marketPhotos = photos[market.id] || [];
  photosDiv.innerHTML = marketPhotos.map(p=>`<img src="${p}" alt="Market Photo">`).join('');

  // Upload photo
  if(currentUser){
    document.getElementById('uploadPhotoBtn').onclick = ()=>{
      const fileInput = document.getElementById('photoInput');
      const file = fileInput.files[0];
      if(file){
        const reader = new FileReader();
        reader.onload = ()=> {
          photos[market.id] = photos[market.id] || [];
          photos[market.id].push(reader.result);
          localStorage.setItem("closestfarm_photos",JSON.stringify(photos));
          showMarketInfo(market);
          alert("Photo uploaded!");
        };
        reader.readAsDataURL(file);
      }
    };

    // Check-in
    document.getElementById('checkinBtn').onclick = ()=>{
      checkins[market.id] = checkins[market.id] || [];
      checkins[market.id].push({user:currentUser,time:new Date().toLocaleString()});
      localStorage.setItem("closestfarm_checkins",JSON.stringify(checkins));
      alert("Checked in! Points +1");
      users[currentUser] = users[currentUser]||{points:0,badges:[]};
      users[currentUser].points += 1;
      localStorage.setItem("closestfarm_users",JSON.stringify(users));
      showMarketInfo(market);
    };
  }

  // Social sharing
  const url = window.location.href;
  document.getElementById('shareTwitter').onclick = ()=>window.open(`https://twitter.com/intent/tweet?text=Check+out+${market.name}+on+ClosestFarm!&url=${url}&hashtags=ClosestFarm,FarmersMarket`,'_blank');
  document.getElementById('shareFB').onclick = ()=>window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`,'_blank');
  document.getElementById('shareLinkedIn').onclick = ()=>window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${market.name}`,'_blank');
  document.getElementById('shareWhatsApp').onclick = ()=>window.open(`https://api.whatsapp.com/send?text=Check+out+${market.name}+on+ClosestFarm! ${url}`,'_blank');
}

// ----------------------
// Search Markets
document.getElementById('marketSearch').addEventListener('input',(e)=>{
  const term = e.target.value.toLowerCase();
  markers.forEach((marker,i)=>{
    if(markets[i].name.toLowerCase().includes(term) || markets[i].city.toLowerCase().includes(term)){
      marker.addTo(map);
    }else{
      map.removeLayer(marker);
    }
  });
});

// ----------------------
// User Login
document.getElementById('loginBtn').onclick = ()=>{
  const name = document.getElementById('usernameInput').value.trim();
  if(name){
    currentUser = name;
    users[currentUser] = users[currentUser]||{points:0,badges:[]};
    localStorage.setItem("closestfarm_users",JSON.stringify(users));
    document.getElementById('welcomeMsg').textContent = `Welcome, ${currentUser}! Points: ${users[currentUser].points}`;
  }
};

// ----------------------
// Initialize
window.onload = initMap;
