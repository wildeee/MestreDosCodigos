const geolicationHelper = (() => {
	const askForPermission = () => {
		return new Promise((response, reject) => {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(response, getMessagedDenialFunction(reject));
			} else {
				reject('Geolocalização não está disponível para seu navegador.');
			}
		});
	};

	const getMessagedDenialFunction = (rejectFunction) => {
		return ((denialDetails) => {
			rejectFunction('O usuário negou a geolocalização.');
		});
	}

	return {askForPermission};
})();