const Express = require("express");
const Path = require("path");
const Config = require("./config.json");
const axios = require("axios");
const fs = require('fs');

// Set up express
const app = Express();
const port = 3000;

// Express middleware
app.use(Express.json());
app.use(Express.static(Path.join(__dirname, "public")));

// Other setup stuff
const path = "./data.json";

// Get the api key
const apiKey = Config["googleApiKey"];

  
// Add a new establishment
app.post("/add-establishment", async (request, response) => {

	// Get the body payload with all of the
	// establishments details
	let establishment = request.body;
	
	// Get the coordinates of the location
	// because the person registering them
	// probably doesn't know what they are
	const coordinates = await coordinatesFromAddress(establishment["address"]);
	establishment["coordinates"] = {
		latitude: coordinates["latitude"],
		longitude: coordinates["longitude"]
	}
  
	// Retrieve the current JSON data and
	// add the new establishment to it
	const json = getEstablishments();
	json.push(establishment);
  
	// Write the updated JSON back to the file
	saveEstablishments(json);

	// Say that we've added it
	response.send("Registered Establishment").status(200);
});

// Get all establishments within a certain distance from an address
app.get("/establishments/:address/:searchDistance", async (request, response) => {

	// Get the address and the distance to
	// search from the request parameters
	const address = request.params.address;
	const searchRadius = parseInt(request.params.searchDistance);

	// Get the coordinates of the current place
	const targetCoordinates = await coordinatesFromAddress(address);

	// Get all of the establishments
	// TODO: Filter by country/city thingy so we don't get every single one
	const establishments = [];
	getEstablishments().forEach(establishment => {
		
		// Get the distance between the current
		// establishment and the target address
		const distance = haversineDistance(targetCoordinates, establishment["coordinates"]);
		console.log(distance);
		if (distance >= searchRadius) return;

		// Add the establishment to the outgoing list
		// so that it can be returned to the client
		establishments.push(establishment);
	});

	// Send back all of the establishments
	response.json(establishments).status(200);
});

// Get the distance between two points on a sphere (km)
function haversineDistance(firstPosition, secondPosition) {

	console.log(`Second position distance ${secondPosition}`);

	// The radius of the earth in km
	// TODO: Add interplanetary support
	const radius = 6371.0072;

	// Convert the coordinates from degrees to radians
	// and also get their distances
	const latitudeDistance = (secondPosition["latitude"] - firstPosition["latitude"]) * (Math.PI / 180);
	const longitudeDistance = (secondPosition["longitude"] - firstPosition["longitude"]) * (Math.PI / 180);

	// actual haversine formula thingy
	const a = 
	Math.sin(latitudeDistance / 2) * Math.sin(latitudeDistance / 2) +
	Math.cos(firstPosition.latitude * Math.PI / 180) * Math.cos(secondPosition.latitude * Math.PI / 180) *
	Math.sin(longitudeDistance / 2) * Math.sin(longitudeDistance / 2);

	// Get the angle and convert it to a distance
	// according to the size of the Earth
	const centralAngle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const distance = radius * centralAngle;

	// Give back the distance
	return distance;
}

async function coordinatesFromAddress(address) {
	
	// Encode the address for sending
	address = encodeURIComponent(address);

	// Make the request to the google maps API
	const addressData = await httpGet(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`);

	// Get the coordinates from the result
	const coordinates = {
		latitude: parseFloat(addressData["results"][0]["geometry"]["location"]["lat"]),
		longitude: parseFloat(addressData["results"][0]["geometry"]["location"]["lng"])
	}

	// Return them
	return coordinates;
}

// Start the server
app.listen(port, () => console.log(`Server listening on port ${port}\nConnect via http://localhost:${port}\n\nAlso you might need to manually create ./data/json`));



function getEstablishments() {
	const json = fs.readFileSync(path, 'utf8');
	return JSON.parse(json);
}


function saveEstablishments(json) {
	const jsonString = JSON.stringify(json, null, "\t");
	fs.writeFileSync(path, jsonString, 'utf8');
}

// TODO: Don't use axios (node-fetch)
async function httpGet(url) {
	try {
		const response = await axios.get(url);
		return response.data;
	} catch (error) {
		console.error(`Error: ${error.message}`);
	}
}