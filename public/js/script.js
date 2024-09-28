const socket = io();

// Watch the user's geolocation
navigator.geolocation.watchPosition(
    (position) => {
        const { latitude, longitude } = position.coords;
        console.log(latitude, longitude);
        socket.emit("sendLocation", { latitude, longitude });
    },
    (error) => {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.error("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                console.error("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                console.error("The request to get user location timed out.");
                break;
            default:
                console.error("An unknown error occurred.");
        }
    },
    {
        enableHighAccuracy: true,
        timeout: 5000, 
        maximumAge: 0
    }
);

// Initialize the map
const map = L.map("map").setView([0, 0], 10);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "SOUMYA's MAP PROJECT"
}).addTo(map);

const markers = {};

// Update markers based on received location data
socket.on("recieveLocation", (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 16);
    if (markers[id]) {
        markers[id].setLatLng([latitude, longitude]);
    } else {
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

// Handle user disconnection
socket.on("userDisconnect", (id) => {
    if (markers[id]) {
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});
