pragma solidity ^0.4.17;

contract CampaignFactory {
	address[] public deployedCampaigns;

	function createCampaign(uint minimumContribution, string title, string description) public {
		address newCampaign = new Campaign(minimumContribution, msg.sender, title, description);
		deployedCampaigns.push(newCampaign);
	}

	function getDeployedCampaigns() public view returns (address[]) {
		return deployedCampaigns;
	}
}

contract Campaign {
	struct Request {
		mapping(address => bool) approvals;
		uint approvalCount;
		bool complete;
		string description;
		address recipient;
		uint value;
	}

	mapping(address => bool) public approvers;
	uint public approversCount;
	string public description;
	address public manager;
	uint public minimumContribution;
	Request[] public requests;
	string public title;

	modifier restricted() {
		require(msg.sender == manager);
		_;
	}

	// @constructor
	function Campaign(uint minCon, address creator, string t, string desc) public {
		manager = creator;
		minimumContribution = minCon;
		title = t;
		description = desc;
	}

	function approveRequest(uint index) public {
		Request storage request = requests[index];

		require(approvers[msg.sender]);
		require(!request.approvals[msg.sender]);

		request.approvals[msg.sender] = true;
		request.approvalCount++;
	}

	function contribute() public payable {
		require(msg.value >= minimumContribution);

		// Only increase approver count if new contributor
		if (approvers[msg.sender] == false) {
			approversCount++;
		}
		approvers[msg.sender] = true;
	}

	function createRequest(string description, uint value, address recipient) public restricted {
		Request memory newRequest = Request({
			description : description,
			value : value,
			recipient : recipient,
			complete : false,
			approvalCount : 0
		});

		requests.push(newRequest);
	}

	function finalizeRequest(uint index) public restricted {
		Request storage request = requests[index];

		require(request.approvalCount > (approversCount / 2));
		require(!request.complete);

		request.recipient.transfer(request.value);
		request.complete = true;
	}

	function getDetails() public view returns (
		uint, uint, uint, uint, address, string, string
	) {
		return (
			minimumContribution,
			this.balance,
			requests.length,
			approversCount,
			manager,
			title,
			description
		);
	}

	function getRequestCount() public view returns (uint) {
		return requests.length;
	}

	function getSummary() public view returns (uint, string, string) {
		return (
			minimumContribution,
			title,
			description
		);
	}
}
