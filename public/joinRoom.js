function joinRoom(roomName) {
  // Send this roomName to the server

  nsSocket.emit("joinRoom", roomName, newNumberOfMembers => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newNumberOfMembers}<span class="glyphicon glyphicon-user"></span
          ></span>`;
  });
  nsSocket.on("historyCatchUp", history => {
    console.log("history", history);
    const messageUl = document.querySelector("#messages");
    messageUl.innerHTML = "";
    messageUl.innerHTML = history.map(msg => buildHtml(msg)).join("");
    messageUl.scrollTo(0, messageUl.scrollHeight);
  });
  nsSocket.on("updateMembers", numMembers => {
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${numMembers}<span class="glyphicon glyphicon-user"></span
          ></span>`;
    document.querySelector(".curr-room-text").innerText = `${roomName}`;
  });
  let searchBox = document.querySelector("#search-box");
  searchBox.addEventListener("input", e => {
    let messages = Array.from(document.getElementsByClassName("message-text"));

    messages.forEach(msg => {
      if (
        msg.innerText.toLowerCase().indexOf(e.target.value.toLowerCase()) === -1
      ) {
        msg.style.display = "none";
      } else {
        msg.style.display = "block";
      }
    });
  });
}
