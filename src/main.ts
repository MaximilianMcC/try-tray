// Imports and whatnot
// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2";
import "https://deno.land/x/dotenv@v3.2.2/load.ts";

// Set up express
const app = express();
const port: number = 3000;

// Express middleware
app.use(express.json());

// Other setup stuff
const path = "./data.json";
interface Establishment {
	name: string;
	website: string;
	rating: number;

	customizable: boolean;
	simpleItems: boolean;
	menu: Dish[];
	
	address: string;
	coordinates: Coordinate;
}

interface Dish {
	name: string;
	description: string;
	foodItems: string[];
}

interface Coordinate {
	latitude: number;
	longitude: number;
}
  
// Get the api key
const apiKey = Deno.env.get("GOOGLE_API_KEY");


// Test
app.get("/test", (request, response) => {

	response.send("<h1>kia ora</h1>");
});

// Add a new establishment
app.post("/add-establishment", (request, response) => {

	// Get the body payload with all of the
	// establishments details
	const establishment: Establishment = request.body;
  
	// Retrieve the current JSON data and
	// add the new establishment to it
	const json: Establishment[] = getEstablishments();
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
	const address: string = request.params.address;
	const searchRadius: number = parseInt(request.params.searchDistance);

	// Use the google maps API to convert the address
	// to latitude and longitude coordinates
	const addressData = await httpGet(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
	const targetCoordinates: Coordinate = {
		latitude: parseFloat(addressData["results"][0]["geometry"]["location"]["lat"]),
		longitude: parseFloat(addressData["results"][0]["geometry"]["location"]["long"])
	}

	console.log(targetCoordinates);

	// Get all of the establishments
	// TODO: Filter by country/city thingy so we don't get every single one
	const establishments: Establishment[] = [];
	getEstablishments().forEach(establishment => {
		
		// Get the distance between the current
		// establishment and the target address
		const distance = haversineDistance(targetCoordinates, establishment.coordinates);
		if (distance <= searchRadius) return;

		// Add the establishment to the outgoing list
		// so that it can be returned to the client
		establishments.push(establishment);
	});

	// Send back all of the establishments
	response.json(establishments).status(200);
});

// Get the distance between two points on a sphere (km)
function haversineDistance(firstPosition: Coordinate, secondPosition: Coordinate) {
	
	// The radius of the earth in km
	// TODO: Add interplanetary support
	const radius: number = 6371;

	// Convert the coordinates from degrees to radians
	// and also get their distances
	const latitudeDistance = (secondPosition.latitude - firstPosition.latitude) * (Math.PI / 180);
	const longitudeDistance = (secondPosition.longitude - firstPosition.longitude) * (Math.PI / 180);

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

// Start the server
app.listen(port, () => console.log(`Server listening on port ${port}\nConnect via http://localhost:${port}\n\nAlso you might need to manually create ./data/json`));



function getEstablishments(): Establishment[] {

	const json = Deno.readTextFileSync(path);
	return JSON.parse(json);
}

function saveEstablishments(json: Establishment[]): void {

	//? using tab indentation btw
	const jsonString = JSON.stringify(json, null, "\t");
	Deno.writeTextFileSync(path, jsonString);
}

async function httpGet(url:string) {
	
	try {
		const response = await fetch(url);
		const data = await response.json();
		return data;

	} catch (error) {
		console.log(error);
		return null;
	}
}