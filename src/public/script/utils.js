async function httpGet(url) {
	
	// Make the request
	try {
		const response = await fetch(url);
		return response.json();
		
	} catch (error) {
		
		console.error("error with the http request");
	}
}