// --- FIREBASE CONFIG ---
const firebaseConfig = {
  apiKey: "FREE_TO_USE",
  authDomain: "closestfarm-firebase.firebaseapp.com",
  projectId: "closestfarm-firebase",
  storageBucket: "closestfarm-firebase.appspot.com",
  messagingSenderId: "12345",
  appId: "1:12345:web:abcd"
};
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// --- AUTH ---
const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider);
});

// --- MAP INIT ---
const map = L.map('map').setView([39.5, -98.35], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'&copy; OpenStreetMap'
}).addTo(map);

const farmLayer = L.layerGroup().addTo(map);

// --- ADD FARM MARKER FUNCTION ---
function addFarmMarker(lat, lng, name, uid) {
  const marker = L.marker([lat,lng]).addTo(farmLayer);
  marker.bindPopup(`<b>${name}</b><br><button onclick="checkIn('${uid}')">Check In</button>
                    <form onsubmit="uploadPhoto(event, '${uid}')">
                      <input type="file" class="photoInput" required>
                      <button type="submit">Upload Photo</button>
                      <input type="text" class="honeypot" style="display:none">
                    </form>`);
}

// --- AUTH STATE CHANGE ---
auth.onAuthStateChanged(user=>{
  if(user){
    addFarmMarker(40.7128,-74.0060,user.displayName,user.uid);
  }
});

// --- CHECK-IN FUNCTION ---
function checkIn(uid){
  const user = auth.currentUser;
  if(user && user.uid===uid){
    db.collection('checkins').add({
      uid:user.uid,
      timestamp:new Date(),
      location:{lat:40.7128,lng:-74.0060}
    });
    alert('Checked in!');
  }
}

// --- PHOTO UPLOAD ---
function uploadPhoto(e, uid){
  e.preventDefault();
  const form = e.target;
  const honeypot = form.querySelector('.honeypot').value;
  if(honeypot){alert('Spam detected'); return;} // honeypot spam prevention

  const fileInput = form.querySelector('.photoInput');
  const file = fileInput.files[0];
  const ref = storage.ref().child('photos/'+Date.now()+'_'+file.name);
  ref.put(file).then(()=> ref.getDownloadURL()).then(url=>{
    db.collection('photos').add({
      uid:uid,
      url:url,
      timestamp:new Date(),
      location:{lat:40.7128,lng:-74.0060}
    });
    alert('Photo uploaded!');
  });
}
