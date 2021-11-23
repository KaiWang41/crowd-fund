import _ from 'lodash';
import propTypes from 'prop-types';
import React from 'react';
import { Button, Card, Message } from 'semantic-ui-react';
import Layout from '../components/Layout';
import C from '../constants';
import S from '../constants/strings';
import Campaign from '../ethereum/campaign';
import factory from '../ethereum/factory';
import { Link } from '../routes';

CampaignIndex.propTypes = {
	campaigns: propTypes.arrayOf(propTypes.object),
};

// @next.js
CampaignIndex.getInitialProps = async () => {
	try {
		const addresses = await factory.methods.getDeployedCampaigns().call();

		const campaigns = await Promise.all(_.map(addresses, async address => {
			const summary = await Campaign(address).methods.getSummary().call();
			return {
				address,
				minContribution: summary[0],
				title: summary[1],
				description: summary[2],
			};
		}));

		return { campaigns };
	} catch (e) {
		console.error(e);
		return { campaigns: [] };
	}
};

/**
 * Home page displaying all campaigns.
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
function CampaignIndex(props) {
	/**
	 * Render list of campaigns as cards.
	 * @return {JSX.Element}
	 */
	function renderCampaigns() {
		const items = _.map(props.campaigns, c => ({
			description: _.truncate(c.description, { length: 400 }),
			fluid: true,
			header: c.title,
			href: C.ROUTES.CAMPAIGN(c.address),
			meta: c.address,
		}));

		return _.isEmpty(items) ?
			<Message content={S.MESSAGES.ADD_CAMPAIGN} header={S.LABELS.NO_CAMPAIGNS} info /> :
			<Card.Group items={items} />;
	}

	/**
	 * Render page.
	 */
	return (
		<Layout>
			<h3>Open Campaigns</h3>

			<Link route={C.ROUTES.CAMPAIGN_NEW}>
				<Button content='Create Campaign' floated='right' icon='add circle' primary />
			</Link>

			{renderCampaigns()}
		</Layout>
	);
}

export default CampaignIndex;
