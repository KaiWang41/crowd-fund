import Head from 'next/head';
import PropTypes from 'prop-types';
import React from 'react';
import { Container, Dimmer, Loader } from 'semantic-ui-react';
import Header from './Header';

Layout.propTypes = {
	isLoading: PropTypes.bool,
};

/**
 * App page layout.
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
function Layout(props) {
	return (
		<>
			<Head>
				<link
					async
					rel='stylesheet'
					href='https://cdn.jsdelivr.net/npm/semantic-ui@2/dist/semantic.min.css'
				/>
			</Head>

			<Dimmer active={props.isLoading} inverted>
				<Loader indeterminate />
			</Dimmer>

			<Container>
				<Header />
				{props.children}
			</Container>
		</>
	);
}

export default Layout;
