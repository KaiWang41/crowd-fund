import PropTypes from 'prop-types';
import React, { memo, useState } from 'react';
import { Button, Form, Input, Message } from 'semantic-ui-react';

ContributeForm.propTypes = {
	errorMessage: PropTypes.string,
	handleSubmit: PropTypes.func.isRequired,
};

/**
 * Contribution form component.
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
function ContributeForm(props) {
	const [value, setValue] = useState('');

	/**
	 * Render component.
	 */
	return (
		<Form error={!!props.errorMessage} onSubmit={e => {
			e.preventDefault();
			props.handleSubmit(value);
		}}>
			<Form.Field>
				<label>Contribute to this campaign!</label>
				<Input
					label='ether'
					labelPosition='right'
					onChange={e => setValue(e.target.value)}
					value={value}
				/>
			</Form.Field>

			<Message content={props.errorMessage} error header='Oops...' />
			<Button primary type='submit'>Confirm</Button>
		</Form>
	);
}

export default memo(ContributeForm);
