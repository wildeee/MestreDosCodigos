const mapInitializer = (() => {

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
		showPosition(position);
		let map = showMap(position);
		markMap(map)
		registerClickListener(map.map);
	}

	const showNotMarkedMap = (message) => {
		showGeolocationProblem(message);
		let map = showMap();
		registerClickListener(map.map);
	}

	const showMap = (position) => {
		let mapInitialState = getMapInitialState(position);
		return {
			map: getMap(mapInitialState),
			point: mapInitialState.center
		};
	}

	const showPosition = (position) => {
		showElement('your-localization');
		document.getElementById('latitude').innerHTML = position.coords.latitude;
		document.getElementById('longitude').innerHTML = position.coords.longitude;
	}

	const showGeolocationProblem = (message) => {
		document.getElementById('geolocation-problem-message').innerHTML = message;
		showElement('geolocation-problem-message');
	}

	const showElement = (elementID) => {
		document.getElementById(elementID).classList.remove('display-none');
	}

	const getMapInitialState = (position) => {
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
		mapInitialState.disableDoubleClickZoom = true;
		return mapInitialState;
	};

	const getMap = (mapInitialState) => {
		return new google.maps.Map(document.getElementById('map'), mapInitialState);
	};

	const markMap = (map) => {
		new google.maps.Marker({
			position: map.point,
			map: map.map
		})
	};

	const registerClickListener = (map) => {
		google.maps.event.addListener(map, 'dblclick', onMapDblClick);
	};

	const onMapDblClick = (e) => {
		let coordinates = {
			lat: e.latLng.lat(),
			lng: e.latLng.lng()
		}

	};

	return init;

})();