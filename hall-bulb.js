var mqtt = require('mqtt');
var os = require("os");

var client  = mqtt.connect('mqtt://demo.thingsboard.io',{
    username: "DDhor3GjN2g3NFZXKnUW",
	password: 'thingsboard123456'
});

var controlValue = false;

client.on('connect', function () {
    console.log('connected');
    client.subscribe('v1/devices/me/rpc/request/+');
});

client.on('message', function (topic, message) {
    console.log('request.topic: ' + topic);
    console.log('request.body: ' + message.toString());
    var requestId = topic.slice('v1/devices/me/rpc/request/'.length),
    messageData = JSON.parse(message.toString());
    if (messageData.method === 'getValue') {
        client.publish('v1/devices/me/rpc/response/' + requestId, JSON.stringify(controlValue));
    }
    else if(messageData.method === 'setValue'){
        controlValue = messageData.params;
    	console.log('Going to set new control value: ' + controlValue);
    }
    else{
        client.publish('v1/devices/me/rpc/response/' + requestId, message);
    }
});