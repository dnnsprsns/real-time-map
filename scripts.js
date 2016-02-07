// <-- USING SOCKET

// <-- CONSTANTS
var CITIES_AVAILABLE = {};
// CONSTANTS -->

// <-- SOCKET
var socket = io('http://localhost:3002');
socket.on('connect', function(){
  console.log("socket connected..");
});
socket.on('disconnect', function(){
  console.log("socket disconnected!");
});
socket.on('new-visit', function(data){
  dataHandler(data);
});
// SOCKET -->

// <-- METHODS
function setUpMap() {
  $('#map').gmap({'disableDefaultUI':true, 'callback': socket.emit('map-ready')});
}

function dataHandler(city) {
  if (CITIES_AVAILABLE[city.id] != null) CITIES_AVAILABLE[city.id]++
  else CITIES_AVAILABLE[city.id] = 1;
  var marker = {'id': city.id, 'position': new google.maps.LatLng(city.lat, city.lng), 'bounds':true };
  var info = {'content': '<p>' + city.name + ', ' + city.country + '</p><p>Visitor: ' + CITIES_AVAILABLE[city.id] + '</p>' };
  addMarker(marker, info);
}

function addMarker(marker, info) {
  $('#map').gmap('addMarker', marker).click(function() {
    $('#map').gmap('openInfoWindow', info, this);
  });
}
// METHODS -->

jQuery(document).ready(setUpMap);
// USING SOCKET -->




// <-- USING JQUERY GET REQUEST LOOP

// <-- CONSTANTS
// var CITIES_AVAILABLE = {};
// var LOOP_TIME = 3000;
// var INTERVAL = null;
// CONSTANTS -->

// <-- METHODS
// function setUpMap() {
//   $('#map').gmap({'disableDefaultUI':true, 'callback': start});
// }
//
// function start() {
//   INTERVAL = setInterval(getCity, LOOP_TIME);
// }
//
// function stop() {
//   if (!INTERVAL) return;
//   clearInterval(INTERVAL);
//   INTERVAL = null;
// }
//
// function getCity() {
//   $.getJSON("http://localhost:3000/getCity", dataHandler);
// }
//
// function dataHandler(data) {
//   if (data.status == 0) return;
//   var city = data.data;
//   if (CITIES_AVAILABLE[city.id] != null) CITIES_AVAILABLE[city.id]++
//   else CITIES_AVAILABLE[city.id] = 1;
//   var marker = {'id': city.id, 'position': new google.maps.LatLng(city.lat, city.lng), 'bounds':true };
//   var info = {'content': '<p>' + city.name + ', ' + city.country + '</p><p>Visitor: ' + CITIES_AVAILABLE[city.id] + '</p>' };
//   addMarker(marker, info);
//   CITIES_AVAILABLE[city] = '';
// }
//
// function addMarker(marker, info) {
//   $('#map').gmap('addMarker', marker).click(function() {
//     $('#map').gmap('openInfoWindow', info, this);
//   });
// }
// METHODS -->

// jQuery(document).ready(setUpMap);
// USING JQUERY GET REQUEST LOOP -->
