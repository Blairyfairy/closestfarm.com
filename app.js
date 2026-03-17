// Map initialization
let map = L.map('map').setView([39.5,-98.35],4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'&copy; OpenStreetMap contributors' }).addTo(map);

// Sample farmers markets
let markets = [
  {name:"Farmers Market NYC", lat:40.7128, lng:-74.006, photos:[]},
  {name:"Los Angeles Market", lat:34.0522, lng:-118.2437, photos:[]},
  {name:"Chicago Market", lat:41.8781, lng:-87.6298, photos:[]}
];

// Add markers
markets.forEach(m=>{
  let marker = L.circleMarker([m.lat,m.lng],{radius:8,color:'#fff',fillColor:'#34b87a',fillOpacity:1,weight:2}).addTo(map);
  marker.on('click',()=>openMarketInfo(m));
});

// Open Market Info
function openMarketInfo(m){
  const div = document.getElementById('marketInfo');
  div.classList.add('show');
  document.getElementById('marketName').textContent = m.name;

  const gallery = document.getElementById('photoGallery');
  gallery.innerHTML = '';
  m.photos.forEach(p=>{
    let img = document.createElement('img'); img.src=p; gallery.appendChild(img);
  });

  document.getElementById('photoUpload').onchange = function(){
    Array.from(this.files).forEach(file=>{
      let reader = new FileReader();
      reader.onload = function(e){
        m.photos.push(e.target.result);
        let img = document.createElement('img'); img.src=e.target.result; gallery.appendChild(img);
      }
      reader.readAsDataURL(file);
    });
    this.value='';
  }
}

// Check-in
document.getElementById('checkInBtn').onclick = ()=>{
  alert('Checked in successfully!');
}

// Login
document.getElementById('loginBtn').onclick = ()=>{
  const name = document.getElementById('usernameInput').value.trim();
  if(name) document.getElementById('welcomeMsg').textContent = `Welcome, ${name}!`;
}

// Search markets
document.getElementById('searchBtn').onclick = ()=>{
  const val = document.getElementById('marketSearch').value.toLowerCase();
  let found = markets.find(m=>m.name.toLowerCase().includes(val));
  if(found) map.setView([found.lat,found.lng],6,{animate:true});
}
