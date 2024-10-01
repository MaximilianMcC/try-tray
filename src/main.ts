// Imports and whatnot
// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2";

// Set up express
const app = express();
const port: number = 3000;

// Test
app.get("/test", (request, response) => {

	response.send("<h1>kia ora</h1>");
});

// Start the server
app.listen(port,() => console.log(`Server listening on port ${port}\nConnect via http://localhost:${port}`));