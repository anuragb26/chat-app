function joinNs(endpoint) {
  const nsSocket = io(`http://localhost:9000${endpoint}`);
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
  });
}
