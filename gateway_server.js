let localVideo = document.getElementById('local_video');
let localStream = null;
let remoteVideos = [];
const MAX_CONNECTION_COUNT = 3;

// --- multi video ---
let container = document.getElementById('container');
_assert('container', container);

// --- prefix -----
navigator.getUserMedia  = navigator.getUserMedia    || navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia || navigator.msGetUserMedia;
RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
RTCSessionDescription = window.RTCSessionDescription || window.webkitRTCSessionDescription || window.mozRTCSessionDescription;

// ----- use skyway room ----
let myApiKey = '8e431df1-2764-499b-8904-9ab0b8d06d0d'; //null; // set your API key
let peer = null;
let meshRoom = null;
const defaultRoomName = '_oculusgo_test_room';

function getApiKey() {
    let key = document.getElementById('api_key_text').value;
    return key;
}
function setApiKey() {
    document.getElementById('api_key_text').value = myApiKey;
}

function getApiKeyFromURL() {
    const search = window.location.search;
    const re = new RegExp('apikey=([^&=]+)');
    const results = re.exec(search);
    if (results) {
        document.getElementById('api_key_text').value = results[1];
    }
}

function showGoUrl(roomname) {
    const urlSpan = document.getElementById('oculus_url');
    const currentUrl = window.location.href;
    const pos = currentUrl.lastIndexOf('/');
    const goUrl = currentUrl.substr(0, pos + 1) + 'gateway_view.html';
    const a = '<a target="_blank" href="' + goUrl + '">' + goUrl + '</a>';
    urlSpan.innerHTML = a;

    const jupmSpan = document.getElementById('jumb_page');
    const jumpUrl = currentUrl.substr(0, pos + 1) + 'g.html';
    let str = 'Or, please open ' + '<a target="_blank" href="' + jumpUrl + '">' + jumpUrl + '</a>';
    str = str + ' with Oculus Go Browser and type room: "' + roomname + '" , then submit.';
    jupmSpan.innerHTML = str;
}

function clearGoUrl() {
    const urlSpan = document.getElementById('oculus_url');
    urlSpan.innerHTML = '';
}

function recievePeer(){
    const apiKey = getApiKey() || myApiKey;
    if ((! apiKey) || (apiKey === '')) {
        alert('Please set your API Key');
        return;
    }

}

function joinRoom() {
    const apiKey = getApiKey() || myApiKey;
    if ((! apiKey) || (apiKey === '')) {
        alert('Please set your API Key');
        return;
    }
    
    peer = new Peer({key: apiKey, turn: true, debug: 1});
    console.log("peer ", peer);
    // const mediaConnection = peer.call(peer.remoteId, localStream);
    peer.on("call", (mediaConnection) => {
        mediaConnection.answer(localStream);
        attachVideo(localVideo);
        // mediaConnection.on("stream", async stream => {
        //     attachVideo(stream);
        // });
        
    });

    console.log("data connect!!");
    peer.on("connection", (dataConnection) => {
        // console.log("recieve!!");
        messaging(dataConnection);
      });
    updateButtons();
    // -- kick to play in iOS 11 Safari --
    //setTimeout(playAllRemoteVideo, 1000);
}

function messaging(dataConnection){
    dataConnection.on("data", ({ name, msg }) => {
        console.log(`${name}: ${msg}`);
        var dest = new ROSLIB.Message({
            data: parseFloat(msg)
        });
        headPosePub.publish(dest);
        $('#main-contents').html('subscribe: ' + msg);
        // => 'SkyWay: Hello, World!'
        
        
      });
}

function leaveRoom() {
    
    if (peer) {
        peer.disconnect();
        peer.destroy();
        peer = null;
    }

    clearGoUrl();
    removeAllVideo();
    updateButtons();
}

// ---- for multi party -----
function isReadyToConnect() {
    if (localStream) {
        return true;
    }
    else {
        return false;
    }
}


// --- video elements ---
function attachVideo(id, stream) {
    let video = addRemoteVideoElement(id);
    playVideo(video, stream, 1.0);

}

function detachVideo(id) {
    let video = getRemoteVideoElement(id);
    if (video) {
        pauseVideo(video);
        deleteRemoteVideoElement(id);
    }
}

function isRemoteVideoAttached(id) {
    if (remoteVideos[id]) {
        return true;
    }
    else {
        return false;
}
}

function addRemoteVideoElement(id) {
    _assert('addRemoteVideoElement() video must NOT EXIST', (! remoteVideos[id]));
    let video = createVideoElement('remote_video_' + id);
    remoteVideos[id] = video;
    return video;
}

function getRemoteVideoElement(id) {
    let video = remoteVideos[id];
    //_assert('getRemoteVideoElement() video must exist', video);
    return video;
}

function deleteRemoteVideoElement(id) {
    _assert('deleteRemoteVideoElement() stream must exist', remoteVideos[id]);
    removeVideoElement('remote_video_' + id);
    delete remoteVideos[id];
}

function createVideoElement(elementId) {
    console.log("remote video")
    let video = document.createElement('video');
    video.width = '1920';
    video.height = '1080';
    video.id = elementId;
    video.playsinline = true; // for iPhone Safari 11

    video.style.border = 'solid black 1px';
    video.style.margin = '2px';

    container.appendChild(video);

    return video;
}

function removeVideoElement(elementId) {
    let video = document.getElementById(elementId);
    _assert('removeVideoElement() video must exist', video);

    container.removeChild(video);
    return video;
}

function removeAllVideo() {
    console.log('===== removeAllRemoteVideo ======');
    for(let key in remoteVideos) {
        let video = remoteVideos[key];
        video.pause();
        video.srcObject = null;
        container.removeChild(video);
    }
    remoteVideos = [];
}

function playAllRemoteVideo() {
    for(let key in remoteVideos) {
        let video = remoteVideos[key];
        video.play();
    }
}


// ---------------------- media handling ----------------------- 
// ---- device list ---
let audioSelect = document.getElementById('audioSource');
let videoSelect = document.getElementById('videoSource');
let cameraSizeSelect = document.getElementById('camera_size_select');

function getDevice() {
    // -- clear --
    while(videoSelect.lastChild)
    {
        videoSelect.removeChild(videoSelect.lastChild);
    }

    // -- enum device --
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
        .then(stream => callBackDeviceList(stream))
        .catch(err => console.error(err));
}

function callBackDeviceList(stream) {
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
        devices.forEach(function(device) {
        console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
        if (device.kind === 'videoinput') {
            const id = device.deviceId;
            const label = device.label || 'camera' + '(' + id + ')'; // label is available for https 

            const option = document.createElement('option');
            option.setAttribute('value', id);
            option.innerHTML = label;
            videoSelect.appendChild(option);

            if (label.indexOf('THETA V') >= 0) {
            console.log('Find THETA V video');
            option.selected = true;

            cameraSizeSelect.selectedIndex = 2; // THETA V FHD
            }
        }
        else if (device.kind === 'audioinput') {
            const id = device.deviceId;
            const label = device.label || 'microphone' + '(' + id + ')'; // label is available for https 
            const option = document.createElement('option');
            option.setAttribute('value', id);
            option.innerHTML = label;
            audioSelect.appendChild(option);

            if (label.indexOf('THETA V') >= 0) {
            console.log('Find THETA V audio');
            option.selected = true;
            }
        }
        });
        updateButtons();
    })
    .catch(function(err) {
        console.error("getDevices ERROR:", err);
    });

    stopLocalStream(stream);
}

function getMediaOptions() {
    const sizeString = cameraSizeSelect.options[cameraSizeSelect.selectedIndex].value;

    let options = { video: true, audio: true};
    if (sizeString === 'VGA') {
        options.video = { width: { min: 640, max: 640}, height: { min: 480, max: 480 } };
    }
    else if (sizeString === 'HD') {
        options.video = { width: { min: 1280, max: 1280}, height: { min: 720, max: 720 } };
    }
    else if (sizeString === 'FHD') {
        options.video = { width: { min: 1920, max: 1920}, height: { min: 1080, max: 1080 } };
    }
    else if (sizeString === 'THETA-V-FHD') {
        options.video = { width: { min: 1920, max: 1920}, height: { min: 960, max: 960 } };
    }
    else if (sizeString === 'THETA-V-4K') {
        options.video = { width: { min: 3840, max: 3840}, height: { min: 1920, max: 1920 } };
    }

    console.log('camera size=' + sizeString, options);


    const videoSource = videoSelect.value;
    if (videoSource) {
        //options.video = { deviceId: {exact: videoSource} };
        options.video.deviceId = {exact: videoSource};
    }
    const audioSource = audioSelect.value;
    if (audioSource) {
        options.audio = { deviceId: {exact: audioSource} };
    }

    console.log(options);

    return options;
}


// start local video
function startVideo() {
    const options = getMediaOptions();
    getDeviceStream(options)
    .then(function (stream) { // success
        localStream = stream;
        playVideo(localVideo, stream, 0.0);
        updateButtons();
    }).catch(function (error) { // error
        console.error('getUserMedia error:', error);
        return;
    });
}

// stop local video
function stopVideo() {
    pauseVideo(localVideo);
    stopLocalStream(localStream);
    localStream = null;
    updateButtons();
}

function stopLocalStream(stream) {
    let tracks = stream.getTracks();
    if (! tracks) {
        console.warn('NO tracks');
        return;
    }

    for (let track of tracks) {
        track.stop();
    }
}

function getDeviceStream(option) {
    if ('getUserMedia' in navigator.mediaDevices) {
        console.log('navigator.mediaDevices.getUserMadia');
        return navigator.mediaDevices.getUserMedia(option);
    }
    else {
        console.log('wrap navigator.getUserMadia with Promise');
        return new Promise(function(resolve, reject){    
        navigator.getUserMedia(option,
            resolve,
            reject
        );
        });      
    }
}

function playVideo(element, stream, volume) {
    if ('srcObject' in element) {
        element.srcObject = stream;
    }
    else {
        element.src = window.URL.createObjectURL(stream);
    }
    element.play();
    element.volume = volume;
}

function pauseVideo(element) {
    element.pause();
    if ('srcObject' in element) {
        element.srcObject = null;
    }
    else {
        if (element.src && (element.src !== '') ) {
        window.URL.revokeObjectURL(element.src);
        }
        element.src = '';
    }
}

function updateButtons() {
    // -- check device list ready --
    if (videoSelect.options.length == 0) {
        disableElement("start_video_button");
        disableElement("stop_video_button");
        disableElement("join_room_button");
        disableElement("leave_room_button");
        return;
    }

    // -- check localStream ready --
    if (! localStream) {
        enableElement("start_video_button");
        disableElement("stop_video_button");
        disableElement("join_room_button");
        disableElement("leave_room_button");
        
        return;
    }
    else {
        disableElement("start_video_button");
        console.log("get localStream");
    }

    // -- check already in room --
    if (! peer) {
        enableElement("stop_video_button");
        enableElement("join_room_button");
        disableElement("leave_room_button");
        
    }
    else {
        disableElement("stop_video_button");
        disableElement("join_room_button");
        enableElement("leave_room_button");
    }
    console.log("get ", peer);
}

function enableElement(id) {
    let element = document.getElementById(id);
    if (element) {
        element.removeAttribute('disabled');
    }
}

function disableElement(id) {
    let element = document.getElementById(id);
    if (element) {
        element.setAttribute('disabled', '1');
    }    
    
}

// ----- init ------
updateButtons();
// getApiKeyFromURL();
setApiKey()


