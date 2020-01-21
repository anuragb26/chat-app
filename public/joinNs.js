function joinNs(endpoint) {
  nsSocket = io(`http://localhost:9000${endpoint}`);
  nsSocket.on("nsRoomLoad", nsRooms => {
    console.log("rooms", nsRooms);
    let roomList = document.querySelector(".room-list");
    roomList.innerHTML = "";
    nsRooms.forEach(room => {
      roomList.innerHTML += `<li class="room">
                    <span class="glyphicon glyphicon-${
                      room.privateRoom ? "lock" : "globe"
                    }"></span>${room.roomTitle}
                </li>`;
    });
    let roomNodes = document.getElementsByClassName("room");
    Array.from(roomNodes).forEach(elem => {
      elem.addEventListener("click", e => {
        console.log("Someone clicked on ", e.target.innerHTML);
      });
    });
    // add room automatically ... first time here
    const topRoom = document.querySelector(".room");
    const topRoomName = topRoom.innerText;
    console.log("topRoomName", topRoomName);
    joinRoom(topRoomName);
    nsSocket.on("messageToClients", msg => {
      console.log("msg", msg);
      document.querySelector("#messages").innerHTML += buildHtml(msg);
    });
    document
      .querySelector(".message-form")
      .addEventListener("submit", event => {
        event.preventDefault();
        const newMessage = document.querySelector("#user-message").value;
        nsSocket.emit("newMessageToServer", { text: newMessage });
      });
  });
}

function buildHtml(msg) {
  const newHtml = `<li>
          <div class="user-image">
            <img src="${msg.avatar}" />
          </div>
          <div class="user-message">
            <div class="user-name-time">${msg.username} <span>${new Date(
    msg.time
  ).toLocaleString()}</span></div>
            <div class="message-text">${msg.text}</div>
          </div>
        </li>`;
  return newHtml;
}
