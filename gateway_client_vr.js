// ----- use skyway room ----
let myApiKey = '8e431df1-2764-499b-8904-9ab0b8d06d0d'; //null; // set your API key
let peer = null;
let remoteId = null;

function getApiKey() {
  let key = document.getElementById('api_key_text').value;
  return key;
}

function getApiKeyFromURL() {
  const search = window.location.search;
  const re = new RegExp('apikey=([^&=]+)');
  const results = re.exec(search);
  if (results) {
    return results[1];
  }

  return null;
}

let localStream = null;
let displayStream = null;
function startMediaAndJoinRoom() {
  const mediaConstraints = {video: false, audio: true};
  navigator.mediaDevices.getUserMedia(mediaConstraints)
  .then( stream => {
    localStream = stream;
    callPeer(stream);
  })
  .catch ( err => {
    console.log("get media stream");
    console.error('getUserMedia ERROR:', err );
  })
}

function callPeer(stream){
  // let apiKey = getApiKeyFromURL() || myApiKey;
  // if ((! apiKey) || (apiKey === '')) {
  //   alert('Please set your API Key');
  //   return;
  // }
  // peer = new Peer({key: apiKey, turn: true, debug: 3});
  remoteId = peer.id;
  console.log("peer ID:"+ peer.id);
  const mediaConnection = peer.call(peer.id, stream);
  // peer.on("call", (mediaConnection) => {
  //   mediaConnection.answer(stream);
  //   attachVideo(mediaConnection.localStream);
  // });
  // mediaConnection.on("stream", stream => {
  //   attachVideo(remoteId, stream);
  // });
  attachVideo(mediaConnection.localStream);
}

function attachVideo(id, stream) {
  const videoElement = document.getElementById("video1");
  videoElement.srcObject = stream;
  videoElement.play();
  console.info("remote media start");
}

function detachVideo(id) {
  const videoElement = document.getElementById("video1");
  videoElement.pause();
  videoElement.srcObject = null;
  console.info("remote media stop");
}

function hideWaitMessage() {
  const element = document.getElementById("wait_massage");
  element.style.display = 'none';
}

let apiKey = getApiKeyFromURL() || myApiKey;
if ((! apiKey) || (apiKey === '')) {
  alert('Please set your API Key');
}
peer = new Peer({key: apiKey, turn: true, debug: 1});
peer.once('open', id => (console.log("set peer id", id)));