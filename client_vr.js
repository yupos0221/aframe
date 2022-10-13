// ----- use skyway room ----
let myApiKey = '8e431df1-2764-499b-8904-9ab0b8d06d0d'; //null; // set your API key
let peer = null;
let meshRoom = null;
const defaultRoomName = '_oculusgo_test_room';

function getApiKey() {
  let key = document.getElementById('api_key_text').value;
  return key;
}

function getApiKeyFromURL() {
  const search = window.location.search;
  const re = new RegExp('apikey=([^&=]+)');
  const results = re.exec(search);
  if (results) {
    //document.getElementById('api_key_text').value = results[1];
    return results[1];
  }

  return null;
}

function getRoomFromURL() {
  const search = window.location.search;
  const re = new RegExp('room=([^&=]+)');
  const results = re.exec(search);
  if (results) {
    //document.getElementById('roomname_text').value = results[1];
    return results[1];
  }
}

let localStream = null;
let displayStream = null;
// let newStream = null;
async function startMediaAndJoinRoom() {
  // displayStream = await navigator.mediaDevices.getDisplayMedia({video:true});
  const mediaConstraints = {video: false, audio: true};
  navigator.mediaDevices.getUserMedia(mediaConstraints)
  .then( stream => {
    // _logStream(stream);
    localStream = stream;
    console.log("get media stream");
    joinRoom(stream);
    
    // const [displayVideoTrack] = displayStream.getVideoTracks();
    // const [userAudioTrack] = stream.getAudioTracks();
    // const newStream = new MediaStream([displayVideoTrack, userAudioTrack]);
    // joinRoom(newStream);
    // joinRoom();
  })
  .catch ( err => {
    console.log("get media stream");
    console.error('getUserMedia ERROR:', err );
  })
}

function joinRoom(stream) {
  let apiKey = getApiKeyFromURL() || myApiKey;
  if ((! apiKey) || (apiKey === '')) {
    alert('Please set your API Key');
    return;
  }
  const roomName = getRoomFromURL() || defaultRoomName;

  peer = new Peer({key: apiKey, debug: 1});
  peer.on('open',function() {
    console.log('--open--');
    //meshRoom = peer.joinRoom(roomName, {mode: 'mesh', stream: localStream});
    if (stream) {
      meshRoom = peer.joinRoom(roomName, {mode: 'mesh', stream: stream});
      console.log('get media');
    }
    else {
      meshRoom = peer.joinRoom(roomName, {mode: 'mesh'});
      console.log('false media');
    }
    meshRoom.on('open', function() {
      console.log('joined the room:' + roomName);
    });
    meshRoom.on('stream', function(remoteStream) {
      let remoteId = remoteStream.peerId;
      attachVideo(remoteId, remoteStream);
    });
    meshRoom.on('peerLeave', function(peerId) {
      detachVideo(peerId);
    });
  });

  // -- kick to play in iOS 11 Safari --
  //setTimeout(playAllRemoteVideo, 1000);
}

function leaveRoom() {
  if (meshRoom) {
     meshRoom.close();
  }

  detachVideo('_any_');
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