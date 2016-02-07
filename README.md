real-time-map - Real Time Map Data Visualization Working Demo
=========================================================

Working application that visualizing sample location data on google map. Data is building randomly on nodejs server with help of city-country geoJson files.

Includes
-----
Application is serving on 'nodejs' using 'node-static' (port 3001). There is also another http server with 'cluster','worker' and 'domain' model for ajax requests (listening port 3000) and last http server with socket.io listening the port 3002.

Although last version is using socket.io to transfer data from server to client, the jquery ajax request loop example is also available and commented in scripts.js file.

Client is using google jquery map api gMap and bootstrap for layout.

Requirements

-----

1. [NodeJS](https://nodejs.org/en/).
2. Bower
```sh
npm install -g bower
```

Installation
-----

1. Download Repo and unzip to any path
2. Go to the selected path on command line. e.g.
```sh
C:\\dnnsprsns\\real-time-map>
```
3. install npm modules
```sh
npm install
```
4. install bower components
```sh
bower install
```
4. run application
```sh
node service.js
```
