const AddressScreenHandler = (() => {
	const addressTypes = [
		{code: 'postal_code', translate: 'CEP'},
		{code: 'street_number', translate: 'Número'},
		{code: 'route', translate: 'Logradouro'},
		{code: 'administrative_area_level_2', translate: 'Cidade'},
		{code: 'administrative_area_level_1', translate: 'Estado'},
		{code: 'country', translate: 'País'}
	];
	return class AddressScreenHandler {
		constructor(addressDiv) {
			this.addressDiv = addressDiv;
		}

		showAddress(address) {
			document.getElementById(this.addressDiv).innerHTML = '';
			let addressesToShow = address.address_components.filter((addressComponent) => addressComponent.types.some(type => addressTypes.some(addressType => addressType.code === type)))
			addressesToShow.reverse().forEach(addressUnit => this._showAddressUnit(addressUnit));
		}

		_showAddressUnit(addressUnit) {
			addressTypes.some(addressType => {
				if (addressUnit.types.indexOf(addressType.code) !== -1) {
					this._appendAddressUnit(addressUnit, addressType.translate);
					return true;
				}
			})
		}

		_appendAddressUnit(addressUnit, unitName) {
			if (addressUnit.long_name === 'Unnamed Road') return;
			document.getElementById(this.addressDiv).innerHTML += '<p>' + unitName + ': ' + addressUnit.long_name + '</p>'
		};
	};
})();