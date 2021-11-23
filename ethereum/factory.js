import CampaignFactory from './build/CampaignFactory.json';
import web3 from './web3';
import ADDRESS from '../ADDRESS.json';

const instance = new web3.eth.Contract(
	JSON.parse(CampaignFactory.interface),
	ADDRESS.FACTORY,
);

export default instance;
