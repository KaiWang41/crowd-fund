import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Button, Form, Grid, Input, Message } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import C from '../../../constants';
import S from '../../../constants/strings';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';
import { Link } from '../../../routes';

RequestNew.propTypes = {
	address: PropTypes.string.isRequired,
};

// @next.js
RequestNew.getInitialProps = props => {
	return { address: props.query?.address };
};

/**
 * Create new request for campaign.
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
function RequestNew(props) {
	const [description, setDescription] = useState('');
	const [amount, setAmount] = useState('');
	const [recipient, setRecipient] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	/**
	 * Handle submit create request form.
	 * @param {Event} event
	 * @return {Promise<void>}
	 */
	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			setIsLoading(true);
			setError('');
			setSuccess('');

			const campaign = Campaign(props.address);
			const accounts = await web3.eth.getAccounts();
			await campaign.methods.createRequest(
				description,
				web3.utils.toWei(amount, 'ether'),
				recipient,
			).send({ from: accounts[0] });

			setDescription('');
			setAmount('');
			setRecipient('');
			setSuccess(S.MESSAGES.NEW_REQUEST_SUCCESS(amount));
		} catch (e) {
			setError(e.message);
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Render the page.
	 */
	return (
		<Layout isLoading={isLoading}>
			<Grid>
				<Grid.Column width={8}>
					<h3>Create Request</h3>
				</Grid.Column>
				<Grid.Column width={8}>
					<Link route={C.ROUTES.REQUESTS(props.address)}>
						<Button basic floated='right'>Back</Button>
					</Link>
				</Grid.Column>
			</Grid>

			<Form error={!!error} onSubmit={handleSubmit}>
				<Form.Field>
					<label>Description</label>
					<Input onChange={e => setDescription(e.target?.value || '')} value={description} />
				</Form.Field>
				<Form.Field>
					<label>Amount</label>
					<Input label='ether' labelPosition='right' onChange={e => setAmount(e.target?.value || '')} value={amount} />
				</Form.Field>
				<Form.Field>
					<label>Recipient</label>
					<Input onChange={e => setRecipient(e.target?.value || '')} value={recipient} />
				</Form.Field>

				<Message content={error} error header='Oops...' />
				<Button primary type='submit'>Create</Button>
				{success && <Message content={success} positive header='Success' onDismiss={() => setSuccess('')} />}
			</Form>
		</Layout>
	);
}

export default RequestNew;
