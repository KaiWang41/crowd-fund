import _, { noop } from 'lodash';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Table } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';

RequestRow.propTypes = {
	approversCount: PropTypes.number.isRequired,
	id: PropTypes.number.isRequired,
	request: PropTypes.object.isRequired,
	setError: PropTypes.func,
	setIsLoading: PropTypes.func,
};

/**
 * A table row displaying one request.
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
function RequestRow(props = { setError: noop, setIsLoading: noop }) {
	const router = useRouter();
	const { Cell, Row } = Table;
	const { approversCount, id, request } = props;
	const readyToFinalize = _.toInteger(request?.approvalCount) > (approversCount / 2);

	/**
	 * Handle click approve or finalise request.
	 * @param {string} action - 'approve' or 'finalize'
	 */
	const handleAction = async (action) => {
		try {
			props.setError('');
			props.setIsLoading(true);

			const campaign = Campaign(props.campaignAddress);
			const accounts = await web3.eth.getAccounts();
			const method = action === 'approve' ? campaign.methods.approveRequest : campaign.methods.finalizeRequest;
			await method(props.id).send({ from: accounts[0] });

			router.reload();
		} catch (e) {
			props.setError(e.message);
		} finally {
			props.setIsLoading(false);
		}
	};

	/**
	 * Render the component.
	 */
	return (
		<Row disabled={request?.complete} positive={readyToFinalize}>
			<Cell>{id + 1}</Cell>
			<Cell>{request?.description}</Cell>
			<Cell>{web3.utils.fromWei(request?.value, 'ether')}</Cell>
			<Cell>{request?.recipient}</Cell>
			<Cell>{request?.approvalCount}/{approversCount}</Cell>
			<Cell>
				{request?.complete ? 'Finalised' : (
					<Button basic color='green' onClick={() => handleAction('approve')}>Approve</Button>
				)}
			</Cell>
			<Cell>
				{request?.complete ? 'Finalised' : (
					<Button basic color='blue' onClick={() => handleAction('finalize')}>Finalise</Button>
				)}
			</Cell>
		</Row>
	);
}

export default RequestRow;
