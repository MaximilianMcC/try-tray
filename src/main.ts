// Imports and whatnot
// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2";

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
	latitude: number;
	longitude: number;
}

interface Dish {
	name: string;
	description: string;
	foodItems: string[];
}
  

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
	const json: Establishment[] = getJson();
	json.push(establishment);
  
	// Write the updated JSON back to the file
	writeJson(json);

	// Say that we've added it
	response.send("Registered Establishment").status(200);
});

// Start the server
app.listen(port,() => console.log(`Server listening on port ${port}\nConnect via http://localhost:${port}\n\nAlso you might need to manually create ./data/json`));



function getJson(): Establishment[] {

	const json = Deno.readTextFileSync(path);
	return JSON.parse(json);
}

function writeJson(json: Establishment[]): void {

	//? using tab indentation btw
	const jsonString = JSON.stringify(json, null, "\t");
	Deno.writeTextFileSync(path, jsonString);
}