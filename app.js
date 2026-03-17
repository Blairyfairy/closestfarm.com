// ======= Preloaded Market Data =======
const marketsData = [
  {"id":1,"name":"Central City Farmers Market","lat":40.7128,"lng":-74.0060,"city":"New York"},
  {"id":2,"name":"Downtown Green Market","lat":34.0522,"lng":-118.2437,"city":"Los Angeles"},
  {"id":3,"name":"Eastside Organic Market","lat":41.8781,"lng":-87.6298,"city":"Chicago"},
  {"id":4,"name":"Riverfront Farmer's Market","lat":29.7604,"lng":-95.3698,"city":"Houston"},
  {"id":5,"name":"Sunset Local Market","lat":33.4484,"lng":-112.0740,"city":"Phoenix"}
];

// ======= User Management =======
let currentUser = null;

function loadUser() {
    const stored = localStorage.getItem('closestfarm_user');
    if(stored) { currentUser = JSON.parse(stored); updatePointsDisplay(); }
}

function loginUser() {
    const name = document.getElementById('usernameInput').value.trim();
    if(!name){ alert('Enter your name'); return; }
    currentUser = { name, points:0, badges:[], checkins:{} };
    localStorage.setItem('closestfarm_user', JSON.stringify(currentUser));
    updatePointsDisplay();
    alert(`Welcome, ${name}!`);
}

function updatePointsDisplay(){
    if(currentUser){
        document.getElementById('pointsDisplay').innerText = `Points: ${currentUser.points}`;
        document.getElementById('badgesDisplay').innerText = `Badges: ${currentUser.badges.join(', ')}`;
    }
}

document.getElementById('loginBtn').addEventListener('click', loginUser);
loadUser();

// ======= Gamification =======
function addPoints(amount){
    if(!currentUser) return;
    currentUser.points += amount;
    localStorage.setItem('closestfarm_user', JSON.stringify(currentUser));
    updatePointsDisplay();
}

function addBadge(badgeName){
    if(!currentUser) return;
    if(!currentUser.badges.includes(badgeName)){
        currentUser.badges.push(badgeName);
        localStorage.setItem('closestfarm_user', JSON.stringify(currentUser));
        alert(`🏆 Badge earned: ${badgeName}`);
        updatePointsDisplay();
    }
}

// ======= Map Initialization =======
let map = L.map('map').setView([39.8283,-98.5795],4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'&copy; OpenStreetMap contributors'
}).addTo(map);

marketsData.forEach(addMarker);

function addMarker(market){
    const marker = L.marker([market.lat,market.lng]).addTo(map);
    marker.on('click',()=>showMarketInfo(market));
}

// ======= Show Market Info =======
function showMarketInfo(market){
    const panel = document.getElementById('infoPanel');
    panel.style.display='block';
    document.getElementById('marketName').innerText = market.name;

    const photosContainer = document.getElementById('photosContainer');
    photosContainer.innerHTML='';
    const storedPhotos = JSON.parse(localStorage.getItem('closestfarm_photos')||'[]');
    storedPhotos.filter(p=>p.marketId===market.id).forEach(p=>{
        const img = document.createElement('img'); img.src=p.url; photosContainer.appendChild(img);
    });

    // Check-in
    document.getElementById('checkInBtn').onclick=()=>{
        if(!currentUser){ alert('Login first'); return; }
        currentUser.checkins[market.id] = new Date().toISOString();
        addPoints(10); addBadge("First Check-in");
        localStorage.setItem('closestfarm_user', JSON.stringify(currentUser));
        alert(`Checked in at ${market.name}`);
    };

    // Photo upload
    const uploadInput = document.getElementById('photoUpload');
    uploadInput.onchange=(e)=>{
        if(!currentUser){ alert('Login first'); return; }
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload=()=>{
            const storedPhotos = JSON.parse(localStorage.getItem('closestfarm_photos')||'[]');
            storedPhotos.push({marketId:market.id,user:currentUser.name,url:reader.result,timestamp:new Date().toISOString()});
            localStorage.setItem('closestfarm_photos',JSON.stringify(storedPhotos));
            addPoints(5); addBadge("First Upload");
            showMarketInfo(market);
        };
        reader.readAsDataURL(file);
    };

    // Social sharing
    const shareDiv = document.getElementById('shareButtons');
    shareDiv.innerHTML='';
    const latestPhoto = storedPhotos.filter(p=>p.marketId===market.id).slice(-1)[0];
    if(latestPhoto){
        const links = generateShareLinks(latestPhoto.url);
        for(const platform in links){
            const a=document.createElement('a');
            a.href=links[platform]; a.target='_blank'; a.innerText=platform.toUpperCase();
            a.style.marginRight='6px'; shareDiv.appendChild(a);
        }
    }
}

// ======= Search Functionality =======
document.getElementById('searchBtn').onclick=()=>{
    const query = document.getElementById('marketSearch').value.toLowerCase();
    map.eachLayer(l=>{ if(l instanceof L.Marker) map.removeLayer(l); });
    marketsData.filter(m=>m.name.toLowerCase().includes(query)||m.city.toLowerCase().includes(query)).forEach(addMarker);
};

// ======= Social Sharing =======
function generateShareLinks(photoURL){
    const hashtags = "#ClosestFarm #FarmersMarket #LocalProduce";
    const url = encodeURIComponent(photoURL);
    const text = encodeURIComponent(`Check out this farmers market! ${hashtags}`);
    return {
        facebook:`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`,
        twitter:`https://twitter.com/intent/tweet?url=${url}&text=${text}`,
        linkedin:`https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`,
        whatsapp:`https://wa.me/?text=${text}%20${url}`,
        telegram:`https://t.me/share/url?url=${url}&text=${text}`,
        pinterest:`https://pinterest.com/pin/create/button/?url=${url}&media=${url}&description=${text}`,
        copy: photoURL
    };
}
