import _ from 'lodash';
import React, { useState } from 'react';
import { Button, Form, Input, Message, TextArea } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

/**
 * Create new campaign page.
 * @return {JSX.Element}
 * @constructor
 */
function CampaignNew() {
	const [title, setTitle] = useState('');
	const [desc, setDesc] = useState('');
	const [minCon, setMinCon] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	/**
	 * Handle submit form.
	 * @param {Event} event
	 * @return {Promise<void>}
	 */
	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			setIsLoading(true);
			setErrorMessage('');

			const accounts = await web3.eth.getAccounts();
			await factory.methods.createCampaign(_.toNumber(minCon), title, desc)
				.send({ from: accounts[0] });

			Router.pushRoute('/');
		} catch (e) {
			setErrorMessage(e.message);
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Render the page.
	 */
	return (
		<Layout isLoading={isLoading}>
			<h3>New Campaign</h3>

			<Form error={!!errorMessage} onSubmit={handleSubmit}>
				<Form.Field>
					<label>Campaign Name</label>
					<Input onChange={e => setTitle(e.target.value)} value={title} />
				</Form.Field>
				<Form.Field>
					<label>Description</label>
					<TextArea onChange={e => setDesc(e.target.value)} value={desc} />
				</Form.Field>
				<Form.Field>
					<label>Minimum Contribution</label>
					<Input label='wei' labelPosition='right' onChange={e => setMinCon(e.target.value)} value={minCon} />
				</Form.Field>

				<Message error header='Oops...' content={errorMessage} />
				<Button color='teal' type='submit'>Create</Button>
			</Form>
		</Layout>
	);
}

export default CampaignNew;
