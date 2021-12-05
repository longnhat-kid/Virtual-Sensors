var mqtt = require('mqtt');
const ACCESS_TOKEN = process.argv[2];

var client  = mqtt.connect('mqtt://demo.thingsboard.io',{
	 username: ACCESS_TOKEN,
	 password:"thingsboard123456"
});

var data ={
	intensity: 350
}
var counter = 0
client.on('connect', function () {
    console.log('connected');
    console.log('Uploading intensity data once per minute...');
    setInterval(publishTelemetry, 1000);
});


function publishTelemetry() {
	counter = counter+1
	if(counter % 10 != 0){
		data.intensity=emulateLightChanging(data.intensity);
		client.publish('v1/devices/me/telemetry', JSON.stringify(data));
	}
	else {
		client.publish('v1/devices/me/telemetry', JSON.stringify({intensity:"#"}));
	}
}

function emulateLightChanging(prevValue) {
	var increment=Math.random();
	var value = prevValue;
	if(increment<0.4){
		value= prevValue - increment * 50;
	}
	else if (increment>=0.4 && increment<0.7){
		value = 320
	}
	else {
		value = prevValue + increment * 10;
	}
	console.log(value)
   return Math.abs(Math.round(value * 100) / 100);
}
