var headPosePub;

$(function() {
    let ros = new ROSLIB.Ros({
        url: 'wss://raspberrypi4.local:9090'
        // url:'wss://127.0.0.1:9090'
        // url:'wss://192.168.11.111:9090'
    });

    ros.on('connection', function() {
        console.log('Connected to websocket server.');
    });
    ros.on('error', function(error) {
        console.log('Error connecting to websocket server: ', error);
    });
    ros.on('close', function() {
        console.log('Connection to websocket server closed.');
    });

    let webtest_listener = new ROSLIB.Topic({
        ros : ros,
        name : '/webtest',
        messageType : 'std_msgs/msg/String'
    });

    function ros_webtest_topic_subscribe() {
        webtest_listener.subscribe(function(message) {
            $('#main-contents').html('subscribe: ' + message.data);
        });
    }
    // ros_webtest_topic_subscribe();

    headPosePub = new ROSLIB.Topic({
        ros : ros,
        name : '/head_angle',
        messageType : 'std_msgs/msg/Float32'
      });

    
});