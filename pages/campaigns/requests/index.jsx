import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, Grid, Message, Table } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import RequestRow from '../../../components/RequestRow';
import C from '../../../constants';
import Campaign from '../../../ethereum/campaign';
import { Link } from '../../../routes';

RequestIndex.propTypes = {
	address: PropTypes.string.isRequired,
	approversCount: PropTypes.number.isRequired,
	requests: PropTypes.arrayOf(PropTypes.object).isRequired,
	requestCount: PropTypes.number.isRequired,
};

// @next.js
RequestIndex.getInitialProps = async props => {
	try {
		const address = props.query?.address;
		const campaign = Campaign(address);
		const requestCount = _.toInteger(await campaign.methods.getRequestCount().call());
		const approversCount = _.toInteger(await campaign.methods.approversCount().call());

		let requests = await Promise.all(_.map(_.range(requestCount), index => {
			return campaign.methods.requests(index).call();
		}));
		// remove duplicate fields '0' - '4'
		requests = _.map(requests, r => _.omit(r, _.range(5)));

		return { address, approversCount, requests, requestCount };
	} catch (e) {
		console.error(e);
		return {};
	}
};

/**
 * List of requests for a campaign.
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
function RequestIndex(props) {
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { Body, Header, HeaderCell, Row } = Table;

	/**
	 * Render table rows for requests.
	 * @return {JSX.Element[]}
	 */
	function renderRows() {
		return _.map(props.requests, (request, index) => (
			<RequestRow
				approversCount={props.approversCount}
				campaignAddress={props.address}
				id={index}
				key={index}
				request={request}
				setError={setError}
				setIsLoading={setIsLoading}
			/>
		));
	}

	/**
	 * Render the page.
	 */
	return (
		<Layout isLoading={isLoading}>
			<Grid>
				<Grid.Column width={8}>
					<h3>Requests</h3>
				</Grid.Column>
				<Grid.Column width={8}>
					<Link route={C.ROUTES.CAMPAIGN(props.address)}>
						<Button basic floated='right'>Back</Button>
					</Link>
					<Link route={C.ROUTES.REQUEST_NEW(props.address)}>
						<Button color='teal' floated='right'>New Request</Button>
					</Link>
				</Grid.Column>
			</Grid>

			<Table>
				<Header>
					<Row>
						<HeaderCell>ID</HeaderCell>
						<HeaderCell>Description</HeaderCell>
						<HeaderCell>Amount (ether)</HeaderCell>
						<HeaderCell>Recipient</HeaderCell>
						<HeaderCell>Approval Count</HeaderCell>
						<HeaderCell>Approve</HeaderCell>
						<HeaderCell>Finalise</HeaderCell>
					</Row>
				</Header>

				<Body>
					{renderRows()}
				</Body>
			</Table>

			<span>Found {props.requestCount} request{props.requestCount === 1 ? '' : 's'}.</span>

			{error && <Message content={error} error header='Oops...' onDismiss={() => setError('')} />}
		</Layout>
	);
}

export default RequestIndex;
