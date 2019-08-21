import Link from 'next/link';
import {Mutation} from 'react-apollo';

import NavStyles from './styles/NavStyles'
import User from './User';
import Signout from './Signout';
import {TOGGLE_CART_MUTATION} from './Cart';
import CartCount from './CartCount';


const Nav = props => (
    <User>
        {({data: {me}}) => (
            <NavStyles>

                <Link href='/items'>
                <a>Items</a>
                </Link>
                
                {me && (
                    <>
                        <Link href='/sell'>
                        <a>Sell</a>
                        </Link>
                        
                        <Link href='/orders'>
                        <a>Orders</a>
                        </Link>
                        
                        <Link href='/me'>
                        <a>Account</a>
                        </Link>

                        <Signout />

                        <Mutation mutation={TOGGLE_CART_MUTATION}>
                            {(toggleCart) => (
                                <button onClick={toggleCart}>
                                    My cart
                                    <CartCount count={me.cart.reduce((prev, curr) => prev + curr.quantity, 0)} />
                                </button>
                            )}
                        
                        </Mutation>
                    </>
                )}

                {!me && (
                    <Link href='/signup'>
                    <a>Sign in</a>
                    </Link>
                )}

            </NavStyles>
        )}
    </User>
);

export default Nav;