const express = require("express");
const app = express();
const socketio = require("socket.io");

let namespaces = require("./data/namespaces");

app.use(express.static(__dirname + "/public"));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.of("/").on("connection", socket => {
  // build an array to send back with the img and endpoint for each namespace
  const namespaceInfo = namespaces.map(({ img, endpoint }) => ({
    img,
    endpoint
  }));
  // send the nsdata back to the client so use socket and not io
  socket.emit("nsList", namespaceInfo);
});

namespaces.forEach(namespace => {
  io.of(namespace.endpoint).on("connection", nsSocket => {
    console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);
    // a socket has connected to one of our namespace
    // send that group info back
    nsSocket.emit("nsRoomLoad", namespaces[0].rooms);
  });
});
