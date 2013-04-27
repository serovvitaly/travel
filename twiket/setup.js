window.twiket = window.twiket || {};
twiket.setup = {
	urls: {
		search: 'https://secure.onetwotrip.com/_api/searching/startSync/',
		statistics: 'https://secure.onetwotrip.com/_api/statcollector/getBF/',
		priceDetails: 'https://secure.onetwotrip.com/_api/confirmation/searchfare/',
		fareRulesOnConformation: 'https://secure.onetwotrip.com/_api/confirmation/getfarerules/',
		createBooking: 'https://secure.onetwotrip.com/_api/confirmation/checkavail1/',
		cancelBooking: 'https://secure.onetwotrip.com/_api/confirmation/cancelconfirm/',
		retrieveBooking: 'https://secure.onetwotrip.com/_api/confirmation/getcheckavailresult1/',
		fareRules: 'https://secure.onetwotrip.com/_api/searching/farerules/',
		createOrder: 'https://secure.onetwotrip.com/_api/process/startcreateorder/',
		createOrderStatus: 'https://secure.onetwotrip.com/_api/process/getprocessresult/',
		orderInfo: 'https://secure.onetwotrip.com/_api/buyermanager/findOrder/',
		itinerary: 'https://secure.onetwotrip.com/itinerary/',
		customeragreement: 'https://secure.onetwotrip.com/customeragreement/',
		tLiveCookie: 'https://www.twiket.com/cookie.html'
	},
	source: 'whitelabel',
	marker: 'marker',
	language: 'ru',
	currency: 'RUB',
	passCountry: 'RU',
	module: {
		passengersCount: true,
		statistics: true,
		currencySelect: true,
		prefered: true,
		matrix: true,
		language: false
	}
};