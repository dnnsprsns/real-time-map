// <-- MODULES
var cluster = require('cluster');
var domainServe = require('domain');
var http = require('http');
var static = require( 'node-static' );
var opener = require('opener');
var io;
// MODULES -->

// <-- CONSTANTS
var WORKERS = 1;
var SERVER_PORT = 3000;
var CLIENT_PORT = 3001;
var SOCKET_PORT = 3002;
var SERVICE = {};
var MAX_COUNT = 0;
var INTERVAL;
// CONSTANTS -->

// <-- CONFIG
var file = new static.Server('.',{
  cache: 0,
  gzip: true
});
var cities = require( './data/geodata/cities.json');
var cityCountries = require( './data/geodata/cities_with_countries.json');
var countryOf = {};
for (var i in cityCountries) {
  countryOf[cityCountries[i].city] = cityCountries[i].country;
}
MAX_COUNT = cities.features.length;
// CONFIG -->

// <-- SERVER
if (cluster.isMaster) {
  for (var i = 0; i < WORKERS; ++i) {
    console.log('worker %s started.', cluster.fork().process.pid);
  }
  cluster.on('disconnect', function(worker) {
    console.error('disconnect!');
    console.log('worker ' + cluster.fork().process.pid + ' born.');
  });
} else {
  // <-- server
  var server = http.createServer(function(request, response) {
    var domain = domainServe.create();
    domain.on('error', function(er) {
      console.error('error', er.stack);
      try {
        var killtimer = setTimeout(function() {
          process.exit(1);
        }, 30000);
        killtimer.unref();
        server.close();
        cluster.worker.disconnect();
        response.statusCode = 500;
        response.end(JSON.stringify({
          status: 0,
          message: 'Domain Error'
        }));
      } catch (er2) {
        console.error('Error sending 500!', er2.stack);
      }
    });
    domain.add(request);
    domain.add(response);
    domain.run(function() {
      if (request.headers.origin) {
        response.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
        response.setHeader('Access-Control-Allow-Methods', 'GET');
      }
      next(request, response);
    });
  });
  server.listen(SERVER_PORT);
  // server -->

  // <-- client
  var client = http.createServer(function(request, response) {
    request.addListener('end',function() {
      file.serve(request, response);
    }).resume();
  });
  client.listen(CLIENT_PORT);
  // client -->

  // <-- socket
  var sckt = http.createServer();
  io = require('socket.io')(sckt);
  io.on('connection', function(socket){
    console.log('socket connected...');
    socket.on('disconnect', function(){
      console.log('socket disconnected!');
    });
    socket.on('map-ready', function(){
      startVisits();
    });
  });
  sckt.listen(SOCKET_PORT);
  // socket -->
  opener('http://localhost:' + CLIENT_PORT);
}
// SERVER -->

// <-- SOCKET
// SOCKET-->

// <-- JQUERY REQUEST SETUP
function next(request, response) {
  var url = request.url.split('/')[1];
  if (SERVICE[url]) {
    SERVICE[url](function(result) {
      response.end(JSON.stringify(result));
    });
  } else response.end(JSON.stringify({
    status: 0,
    message: 'Service Error'
  }));
}
// JQUERY REQUEST SETUP -->

// <-- METHODS
function getIndex() {
  return Math.floor(Math.random() * MAX_COUNT);
}

function getRandomCity() {
  var i = getIndex();
  var obj = cities.features[i];
  var city = decodeURI(obj.id);
  var dt = {
    id: city,
    lat: obj.geometry.coordinates[1],
    lng: obj.geometry.coordinates[0],
    name: city,
    country: countryOf[city]
  };
  return dt;
}

function getLoopTime() {
  return Math.floor(Math.random() * 10) + 1;
}

function startVisits() {
  triggerVisit();
  var t = getLoopTime();
  console.log('waiting ' + t + ' seconds...');
  setTimeout(startVisits, t * 1000);
}

function triggerVisit() {
  var city = getRandomCity();
  console.log('new visit from ' + city.name + ', ' + city.country);
  io.emit('new-visit', city);
}
// METHODS -->

// <-- SERVICES
SERVICE['getCity'] = function(callback) {
  callback({status: 1, data: getRandomCity()});
}
// SERVICES -->
