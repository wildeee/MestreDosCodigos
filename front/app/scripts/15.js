const mapInitializer = (() => {

	let map;
	let coordinates;
	let mark;

	const init = () => {
		askForGeolocationPermission().then(showMarkedMap, showNotMarkedMap);
	}

	const askForGeolocationPermission = () => {
		const getMessagedDenialFunction = (rejectFunction) => {
			return ((denialDetails) => {
				rejectFunction('O usuário negou a geolocalização.');
			});
		}

		return new Promise((response, reject) => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(response, getMessagedDenialFunction(reject));
			} else {
				reject('Geolocalização não está disponível para seu navegador.');
			}
		});
	};

	const showMarkedMap = (position) => {
		coordinates = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};
		showPosition();
		showMap();
		markMap()
		registerClickListener();
	}

	const showNotMarkedMap = (message) => {
		showGeolocationProblem(message);
		showMap();
		registerClickListener();
	}

	const showMap = () => {
		let mapInitialState = getMapInitialState();
		return {
			map: getMap(mapInitialState),
			point: mapInitialState.center
		};
	}

	const showPosition = () => {
		showElement('your-localization');
		document.getElementById('latitude').innerHTML = coordinates.lat;
		document.getElementById('longitude').innerHTML = coordinates.lng;
	}

	const showGeolocationProblem = (message) => {
		document.getElementById('geolocation-problem-message').innerHTML = message;
		showElement('geolocation-problem-message');
	}

	const showElement = (elementID) => {
		document.getElementById(elementID).classList.remove('display-none');
	}

	const getMapInitialState = () => {
		let mapInitialState = {
			zoom: 3,
			center: { lat: 0, lng: 0 }
		};
		if (coordinates !== undefined) {
			mapInitialState = {
				zoom: 6,
				center: coordinates
			}
		}
		mapInitialState.disableDoubleClickZoom = true;
		return mapInitialState;
	};

	const getMap = (mapInitialState) => {
		map = new google.maps.Map(document.getElementById('map'), mapInitialState);
	};

	const markMap = () => {
		mark = new google.maps.Marker({
			position: coordinates,
			map: map
		})
	};

	const registerClickListener = () => {
		google.maps.event.addListener(map, 'dblclick', onMapDblClick);
	};

	const onMapDblClick = (e) => {
		coordinates = {
			lat: e.latLng.lat(),
			lng: e.latLng.lng()
		}
	};

	return init;

})();