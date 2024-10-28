const searchBar = document.querySelector("#locationInput");
searchBar.addEventListener("keydown", async (e) => {
	
	// Check for if they press enter
	if (e.key != "Enter") return;

	// Get the address they entered and
	// generate the url for the request
	const address = searchBar.value;
	const radius = 30;
	const url = `/establishments/${encodeURIComponent(address)}/${radius}`;
	
	// Get all of the responses
	const establishments = await httpGet(url);
	console.log(establishments);
});