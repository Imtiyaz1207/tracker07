let map, marker;

function initMap(lat, lng) {
  map = L.map("map").setView([lat, lng], 16);

  L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  ).addTo(map);

  marker = L.marker([lat, lng]).addTo(map);
}

function update() {
  fetch("/api/status")
    .then(res => res.json())
    .then(data => {

      if (!map) initMap(data.lat, data.lng);
      else {
        marker.setLatLng([data.lat, data.lng]);
        map.setView([data.lat, data.lng]);
      }

      document.getElementById("status").innerText =
        `Lat: ${data.lat}, Lng: ${data.lng}`;
      document.getElementById("motion").innerText = data.motion;
      document.getElementById("relay").innerText = data.relay;
      document.getElementById("camera").src = data.imageUrl;

    });
}

function toggleIgnition(state) {
  fetch("/api/ignition", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ state })
  });
}

setInterval(update, 5000);
