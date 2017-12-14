const mapInitializer = (() => {

	let map;
	let coordinates = {
		lat : undefined,
		lng : undefined,
		set latLng(value) {
			this.lat = value.lat;
			this.lng = value.lng;
			showPosition();
			if (mark) {
				mark.setMap(null);
			}
			markMap();
		},
		get isDefined() {
			return this.lat && this.lng;
		}
	};
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
		coordinates.latLng = {
			lat: position.coords.latitude,
			lng: position.coords.longitude
		};
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
		getMap(mapInitialState);
	}

	const showPosition = () => {
		hideElement('geolocation-problem-message');
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

	const hideElement = (elementID) => {
		document.getElementById(elementID).classList.add('display-none');
	};

	const getMapInitialState = () => {
		let mapInitialState = {
			zoom: 3,
			center: { lat: 0, lng: 0 }
		};
		if (coordinates.isDefined) {
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
		coordinates.latLng = {
			lat: e.latLng.lat(),
			lng: e.latLng.lng()
		}
	};

	return init;

})();