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
	let geocoder;

	const init = () => {
		geocoder = new google.maps.Geocoder;
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
		let location = {
			lat: coordinates.lat,
			lng: coordinates.lng
		};
		document.getElementById('latitude').innerHTML = location.lat;
		document.getElementById('longitude').innerHTML = location.lng;
		geocoder.geocode({location}, (results, status) => {
			document.getElementById('address').innerHTML = '';
			if (status !== 'OK') {
				return;
			}
			showAddress(results[0])
		});
	}


	const showAddress = (address) => {
		const addressTypes = [
			{code: 'postal_code', translate: 'CEP'},
			{code: 'street_number', translate: 'Número'},
			{code: 'route', translate: 'Logradouro'},
			{code: 'administrative_area_level_2', translate: 'Cidade'},
			{code: 'administrative_area_level_1', translate: 'Estado'},
			{code: 'country', translate: 'País'}
		]
		document.getElementById('address').innerHTML = address.formatted_address;
		let addressesToShow = address.address_components.filter((addressComponent) => addressComponent.types.some(type => addressTypes.some(addressType => addressType.code === type)))
		console.log(addressesToShow);
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
