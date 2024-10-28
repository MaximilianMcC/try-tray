let map;

function generateMap() {

	// Set the location and whatnot
	//? Starting location is Auckland rn
	const startingLocation = { lat: -36.8485, lng: 174.7633 };
	const mapSettings = {
		zoom: 10,
		center: startingLocation
	};

	// Make the actual map
	const mapElement = document.getElementById("map");
	map = new google.maps.Map(mapElement, mapSettings);
}