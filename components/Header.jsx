import React from 'react';
import { Menu } from 'semantic-ui-react';
import C from '../constants';
import { Link } from '../routes';

/**
 * Header component.
 * @return {JSX.Element}
 * @constructor
 */
function Header() {
	return (
		<Menu style={{ marginTop: 18 }}>
			<Link route={C.ROUTES.BASE}>
				<a className='item'><h2>SmartRaiser</h2></a>
			</Link>

			<Menu.Menu position='right'>
				<Link route={C.ROUTES.BASE}>
					<a className='item'>Campaigns</a>
				</Link>
			</Menu.Menu>

			<Link route={C.ROUTES.CAMPAIGN_NEW}>
				<a className='item'>+</a>
			</Link>
		</Menu>
	);
}

export default Header;
