import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
	// In the browser where metamask is running
	window.ethereum.request({ method: 'eth_requestAccounts' });
	web3 = new Web3(window.ethereum);
} else {
	// On the server *OR* the user is not running metamask
	const provider = new Web3.providers.HttpProvider(process.env.NETWORK);
	web3 = new Web3(provider);
}

export default web3;
