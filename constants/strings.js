const S = {
	DESCRIPTIONS: {
		APPROVERS_COUNT: 'Number of people who have already donated to this campaign.',
		BALANCE: 'The balance is how much this campaign has left to spend.',
		MANAGER: 'This is the address of the manager who created this campaign and can create requests.',
		MINIMUM_CONTRIBUTION: 'You must contribute at least this much wei to become an approver for this campaign.',
		REQUESTS_COUNT: 'A request tries to withdraw money from the contract. Requests must be approved by approvers.',
	},
	LABELS: {
		APPROVERS_COUNT: 'Number of Approvers',
		BALANCE: 'Campaign Balance (ether)',
		NO_CAMPAIGNS: 'No Open Campaigns',
		MANAGER: 'Address of Manager',
		MINIMUM_CONTRIBUTION: 'Minimum Contribution (wei)',
		REQUESTS_COUNT: 'Number of Requests',
		TITLE: 'Intro',
	},
	MESSAGES: {
		ADD_CAMPAIGN: 'Click Create or the Plus icon to launch your campaign!',
		NEW_REQUEST_SUCCESS: amount => `Created new request of amount ${amount} ether!`,
	},
};

export default S;
