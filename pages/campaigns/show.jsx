import _ from 'lodash';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, Card, Grid } from 'semantic-ui-react';
import ContributeForm from '../../components/ContributeForm';
import Layout from '../../components/Layout';
import C from '../../constants';
import S from '../../constants/strings';
import Campaign from '../../ethereum/campaign';
import web3 from '../../ethereum/web3';
import { Link } from '../../routes';

CampaignShow.propTypes = {
	address: PropTypes.string,
	approversCount: PropTypes.number,
	balance: PropTypes.number,
	description: PropTypes.string,
	manager: PropTypes.string,
	minimumContribution: PropTypes.number,
	requestsCount: PropTypes.number,
	title: PropTypes.string,
};

// @next.js
CampaignShow.getInitialProps = async (props) => {
	try {
		const campaign = Campaign(props.query.address);
		const details = await campaign.methods.getDetails().call();

		return {
			address: props.query.address,
			minimumContribution: _.toNumber(details[0]),
			balance: _.toNumber(web3.utils.fromWei(details[1], 'ether')),
			requestsCount: _.toInteger(details[2]),
			approversCount: _.toInteger(details[3]),
			manager: details[4],
			title: details[5],
			description: details[6],
		};
	} catch (e) {
		console.error(e);
		return {};
	}
};

/**
 * Show campaign details page.
 * @return {JSX.Element}
 * @constructor
 */
function CampaignShow(props) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	/**
	 * Handle submit contribution form.
	 * @param {string} value
	 * @return {Promise<void>}
	 */
	const handleContribute = async value => {
		try {
			setIsLoading(true);
			setErrorMessage('');

			const accounts = await web3.eth.getAccounts();
			await Campaign(props.address).methods.contribute()
				.send({ from: accounts[0], value: web3.utils.toWei(value, 'ether') });

			router.reload();
		} catch (e) {
			setErrorMessage(e.message);
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Render info cards.
	 * @return {JSX.Element}
	 */
	function renderCards() {
		const fields = ['manager', 'minimumContribution', 'requestsCount', 'approversCount', 'balance'];
		const style = { overflowWrap: 'break-word' };

		const items = [
			{
				description: props.description,
				fluid: true,
				header: props.title,
				meta: S.LABELS.TITLE,
				style,
			},
			..._.map(fields, field => {
				const UPPER = _.snakeCase(field).toUpperCase();
				return ({
					description: S.DESCRIPTIONS[UPPER],
					header: props[field],
					key: field,
					meta: S.LABELS[UPPER],
					style,
				});
			}),
		];

		return <Card.Group items={items} />;
	}

	/**
	 * Render the page.
	 */
	return (
		<Layout isLoading={isLoading}>
			<h3>Campaign Details</h3>
			<Grid>
				<Grid.Row>
					<Grid.Column width={11}>
						{renderCards()}
					</Grid.Column>

					<Grid.Column width={5}>
						<ContributeForm errorMessage={errorMessage} handleSubmit={handleContribute} />
					</Grid.Column>
				</Grid.Row>

				<Grid.Row>
					<Grid.Column>
						<Link route={C.ROUTES.REQUESTS(props.address)}>
							<a><Button primary>View Requests</Button> </a>
						</Link>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		</Layout>
	);
}

export default CampaignShow;
