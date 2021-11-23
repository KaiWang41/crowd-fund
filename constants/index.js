const C = {
	ROUTES: {
		BASE: '/',
		CAMPAIGN: address => `/campaigns/${address}`,
		CAMPAIGN_NEW: '/campaigns/new',
		REQUESTS: address => `/campaigns/${address}/requests`,
		REQUEST_NEW: address => `/campaigns/${address}/requests/new`,
	},
};

export default C;
