const socket = io("http://localhost:9000");
let nsSocket = "";
// listen for nsList which is a list of all namespaces
socket.on("nsList", nsData => {
  console.log("List of namespaces have arrived nsData", nsData);
  let namespaceDiv = document.querySelector(".namespaces");
  namespaceDiv.innerHTML = "";
  nsData.forEach(ns => {
    namespaceDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src ="${ns.img}" /></div>`;
  });

  // Add a click listener for each ns
  Array.from(document.getElementsByClassName("namespace")).forEach(elem => {
    elem.addEventListener("click", e => {
      const nsEndpoint = elem.getAttribute("ns");
      console.log(`${nsEndpoint} i should go to now`);
    });
  });
  joinNs("/wiki");
});

/*
    socket.on('ping', () => {
        // this is received every 25 seconds
        console.log('ping was received from the server')
    })
    socket.on('pong', latency => {
        // this is being sent in 5 seconds after every pong so latency has to be 1,2,3,4,5
        console.log(latency)
        console.log('Pong was sent to the server')
})
*/
