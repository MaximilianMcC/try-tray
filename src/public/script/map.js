function generateMap() {

	// Set the location and whatnot
	//? temp location is Auckland rn
	const tempLocation = { lat: -36.8485, lng: 174.7633 };
	const mapSettings = {
		zoom: 10,
		center: tempLocation
	};

	// Make the actual map
	const mapElement = document.getElementById("map");
	const map = new google.maps.Map(mapElement, mapSettings);
}

