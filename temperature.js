var mqtt = require('mqtt');
const ACCESS_TOKEN = process.argv[2];

var client  = mqtt.connect('mqtt://demo.thingsboard.io',{
	 username: ACCESS_TOKEN,
	 password: "thingsboard123456"
});

var data ={
	temperature: 30.00
}
var counter = 0
client.on('connect', function () {
    console.log('connected');
    console.log('Uploading temperature data once per minute...');
    setInterval(publishTelemetry, 60000);
});

function publishTelemetry() {
	counter = counter+1
	if(counter%10!= 0){
		data.temperature=emulateTemperatureChanging(data.temperature);
		client.publish('v1/devices/me/telemetry', JSON.stringify(data));
	}
	else {
		client.publish('v1/devices/me/telemetry', JSON.stringify({temperature:"#"}));
	}
	
}

function emulateTemperatureChanging(prevValue) {
	var increment=Math.random();
	var value = prevValue;
	if(increment<0.4){
		value= prevValue - Math.random() * 10;
	}
	else if (increment>=0.4 && increment<=0.7){
		value=prevValue
	}
	else {
		value = prevValue + Math.random() * 10;
	}
	console.log(value)
   return Math.round(value * 100) / 100;
}
