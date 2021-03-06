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
    // handshake happens only once with the main namespace
    const username = nsSocket.handshake.query.username;
    // console.log(`${nsSocket.id} has joined ${namespace.endpoint}`);
    // a socket has connected to one of our namespace
    // send that group info back
    nsSocket.emit("nsRoomLoad", namespace.rooms);
    nsSocket.on("joinRoom", (roomToJoin, numberOfMembersCallback) => {
      //deal with history, once we have it
      const roomToLeave = Object.keys(nsSocket.rooms)[1];
      nsSocket.leave(roomToLeave);
      updateUsersinRoom(namespace, roomToLeave);
      console.log("rooms", nsSocket.rooms);

      nsSocket.join(roomToJoin);

      const nsRoom = namespaces
        .find(ns => ns.endpoint === namespace.endpoint)
        .rooms.find(room => room.roomTitle === roomToJoin);
      // console.log("on joining room", nsRoom);
      nsSocket.emit("historyCatchUp", nsRoom.history);
      updateUsersinRoom(namespace, roomToJoin);
    });
    nsSocket.on("newMessageToServer", msg => {
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username,
        avatar: "https://via.placeholder.com/30"
      };
      // console.log("msg", fullMsg);
      // Send the message to all the sockets in the room that this socket is in
      // console.log("rooms", nsSocket.rooms);
      // the user will always be in the second room  because the socket joins its own room on connection
      const roomTitle = Object.keys(nsSocket.rooms)[1];
      // we need to find the Room object for this room
      const nsRoom = namespaces
        .find(ns => ns.endpoint === namespace.endpoint)
        .rooms.find(room => room.roomTitle === roomTitle);
      // console.log("nsRoom", nsRoom);
      nsRoom.addMessage(fullMsg);
      io.of(namespace.endpoint)
        .to(roomTitle)
        .emit("messageToClients", fullMsg);
    });
  });
});

function updateUsersinRoom(namespace, roomName) {
  io.of(namespace.endpoint)
    .in(roomName)
    .clients((error, clients) => {
      io.of(namespace.endpoint)
        .in(roomName)
        .emit("updateMembers", clients.length);
    });
}
