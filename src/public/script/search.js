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

	// Clear all the previous stuff so we can
	// put all the new stuff in
	// TODO: Do this
	document.querySelector(".cards").innerHTML = ``;

	// Add all the new stuff in
	establishments.forEach(establishment => {
		addEstablishmentCard(establishment);
		addEstablishmentToMap(establishment);
	});
});

function addEstablishmentCard(establishment) {
	
	let html = `
	<div class="establishment-card">
		<h2>${establishment["name"]}</h2>
		<div class="features">
			<ul>
				<li>Fully customizable</li>
				<li>Has items on your whitelist</li>
				<li>Simple items available</li>
			</ul>
		</div>
		<div class="info">

			<!-- Buttons to get the menu, and website  -->
			<button>Menu</button>
			<a href="${establishment["website"]}">Website</a>

			<!-- Thing showing average rating in terms of 5 stars -->
			<div class="star-container">
				<p>
					<i class="fa-solid fa-star"></i>
					<i class="fa-solid fa-star"></i>
					<i class="fa-solid fa-star"></i>
					<i class="fa-solid fa-star"></i>
					<i class="fa-solid fa-star"></i>
				</p>
			</div>
		</div>
	</div>
	`;

	document.querySelector(".cards").innerHTML += html;
}

// TODO: Put in map.js
function addEstablishmentToMap(establishment) {
	

}