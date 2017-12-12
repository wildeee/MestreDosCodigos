const mapInitializer = (() => {

	let position;

	const showUserDenied = (deny) => {
		showElement('denied-geolocation-message');
		handleMap();
	};

	const showElement = (elementID) => {
		document.getElementById(elementID).classList.remove('display-none');
	}

	const askForLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(locationAccepted, showUserDenied);
		} else {
			showElement('unavailable-geolocation-message');
		}
	}

	const showLocation = () => {
		showElement('your-localization');
		document.getElementById('latitude').innerHTML = position.coords.latitude;
		document.getElementById('longitude').innerHTML = position.coords.longitude;
	}

	const locationAccepted = (pos) => {
		position = pos;
		showLocation();
		handleMap();
	};

	const handleMap = () => {
		let mapInitialState = getMapInitialState();
		let map = getMap(mapInitialState);
		markMap(map, mapInitialState.center);
	};

	const getMapInitialState = () => {
		let mapInitialState = {
			zoom: 3,
			center: { lat: 0, lng: 0 }
		};
		if (position !== undefined) {
			mapInitialState = {
				zoom: 6,
				center: {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				}
			}
		}
		return mapInitialState;
	};

	const getMap = (mapInitialState) => {
		return new google.maps.Map(document.getElementById('map'), mapInitialState);
	};

	const markMap = (map, point) => {
		if (position === undefined) {
			return;
		}
		new google.maps.Marker({
			position: point,
			map: map
		})
	};

	return askForLocation;

})();