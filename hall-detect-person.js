var mqtt = require('mqtt');
var os = require("os");

var client  = mqtt.connect('mqtt://demo.thingsboard.io',{
    username: "UEOsoG0U21t9Ly5DR9Ww",
	password: 'thingsboard123456'
});

var controlValue = false;

client.on('connect', function () {
    console.log('connected');
    client.subscribe('v1/devices/me/rpc/request/+');
    console.log('Uploading signal data once per minutes...');
    setInterval(publishTelemetry, 10000);
});

client.on('message', function (topic, message) {
    console.log('request.topic: ' + topic);
    console.log('request.body: ' + message.toString());
    var requestId = topic.slice('v1/devices/me/rpc/request/'.length),
    	messageData = JSON.parse(message.toString());
    if (messageData.method === 'checkStatus') {
        client.publish('v1/devices/me/rpc/response/' + requestId, message);
    }
});

function publishTelemetry() {
	emulateDetectPersonChanging();
	client.publish('v1/devices/me/telemetry', JSON.stringify({hasPerson: controlValue}));
}

function emulateDetectPersonChanging() {
	var probability = Math.random();
	if (probability <= 0.3){
		controlValue = !controlValue;
	}
    else if (probability >= 0.9){
        controlValue = '##########';
    }
	console.log(controlValue)
}