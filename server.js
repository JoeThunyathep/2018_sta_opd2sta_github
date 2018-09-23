// ----------------------------------------------------
// required variables, dependencies and initialisation 
const express = require('express')
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false })) 
app.use(bodyParser.json())
const requestajax = require('ajax-request');
var request = require('request');
const PORT = process.env.PORT || 8000;
app.use(express.static('public'));
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
  });
// ------------------------------------------------------------------------
// Insert wind datat (speed and direction) every 5 minutes in the database
i = 1;
function insertFunc() {
    i = i+1;
	requestajax('http://api.openweathermap.org/data/2.5/weather?q=Stuttgart,de&APPID=6639a27f3eaab1bee8fa943c7a51a302', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			body = JSON.parse(body);
				var dataStr_temp = {
                    "phenomenonTime": new Date( body.dt * 1000).toISOString(),
                    "resultTime": new Date( body.dt * 1000).toISOString(),
                    "result": body.main.temp,
                    "Datastream": { "@iot.id": 88 }
                }
                var dataStr_pressure = {
                    "phenomenonTime": new Date( body.dt * 1000).toISOString(),
                    "resultTime": new Date( body.dt * 1000).toISOString(),
                    "result": body.main.pressure,
                    "Datastream": { "@iot.id": 89 }
                }
                var dataStr_humidity = {
                    "phenomenonTime": new Date( body.dt * 1000).toISOString(),
                    "resultTime": new Date( body.dt * 1000).toISOString(),
                    "result": body.main.humidity,
                    "Datastream": { "@iot.id": 90 }
                }
                var dataStr_Speed = {
                    "phenomenonTime": new Date( body.dt * 1000).toISOString(),
                    "resultTime": new Date( body.dt * 1000).toISOString(),
                    "result": body.wind.speed,
                    "Datastream": { "@iot.id": 91 }
                }
                var dataStr_Wdeg = {
                    "phenomenonTime": new Date( body.dt * 1000).toISOString(),
                    "resultTime": new Date( body.dt * 1000).toISOString(),
                    "result": body.wind.deg,
                    "Datastream": { "@iot.id": 92 }
                }
                var dataStr_cloud = {
                    "phenomenonTime": new Date( body.dt * 1000).toISOString(),
                    "resultTime": new Date( body.dt * 1000).toISOString(),
                    "result": body.clouds.all,
                    "Datastream": { "@iot.id": 93 }
                }
                var dataStr_tempC = {
                    "phenomenonTime": new Date( body.dt * 1000).toISOString(),
                    "resultTime": new Date( body.dt * 1000).toISOString(),
                    "result": (body.main.temp) -273.15,
                    "Datastream": { "@iot.id": 94 }
                }
				    postSTA(dataStr_temp, i, 'temp');
                    postSTA(dataStr_pressure, i, 'pressure');
                    postSTA(dataStr_humidity, i, 'humidity');
                    postSTA(dataStr_Speed, i, 'WindSpeed');
                    postSTA(dataStr_Wdeg, i, 'WindDeg');
                    postSTA(dataStr_cloud, i, 'clouds');
                    postSTA(dataStr_tempC, i, 'tempC');
		}
	})

 
}
const SENSOR_API_BASE_URL = 'http://gisstudio.hft-stuttgart.de/FROST-icity/v1.0';
const SENSOR_API_FINAL_URL = '/Observations';
function postSTA(item, i, nam) {
    let headers = { 'Content-Type': 'application/json' };
    let options = {
        url: SENSOR_API_BASE_URL + SENSOR_API_FINAL_URL,
        headers: headers,
        method: 'POST',
        body: JSON.stringify(item),
    }
    //console.log(item);
    request(options, function (error, httpResponse, body) {
        if (error) {
            return console.error(`Post data failed:`, error);
        }
        // Print out the response body
        console.log(`Post datastream [${nam}][${i}] to STA successfully!!`, body);
    })
}


// Run the function every 60 mins
const period_OWD = 60 * 60 * 1000;
try {
	setInterval(insertFunc, period_OWD); // [5min *6000] ms 
}
catch(err) {
	console.log('->  POST the wind data successful! at' + (new Date().toLocaleString()) + err);
}
// -----------------
// Server runs info
// console.log("Server running at http://localhost:%d", port);
console.log("==== Start POSTing the data from OpenWather to SensorThings API ====")




