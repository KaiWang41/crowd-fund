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
	const Footer = () => {
		const year = (new Date()).getFullYear();
		return (
			<div
				style={{
					color: 'grey',
					marginTop: 64,
					paddingBottom: 32,
					textAlign: 'center',
					width: '100%',
				}}
			>
				<small>Copyright &copy; {year}, Kangyi Wang. All Rights Reserved</small>
			</div>
		);
	};

	return (
		<>
			<Head>
				<title>SmartRaiser</title>

				<link rel='apple-touch-icon' sizes='180x180' href='/static/apple-touch-icon.png' />
				<link rel='icon' type='image/png' sizes='32x32' href='/static/favicon-32x32.png' />
				<link rel='icon' type='image/png' sizes='16x16' href='/static/favicon-16x16.png' />

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
				<Footer />
			</Container>
		</>
	);
}

export default Layout;
