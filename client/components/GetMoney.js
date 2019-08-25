import React from 'react';
import StripeCheckout from 'react-stripe-checkout';
import {Mutation} from 'react-apollo';
import Router from 'next/router';
import NProgress from 'nprogress';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import calcTotalPrice from '../lib/calcTotalPrice';
import Error from './ErrorMessage';
import User, {CURRENT_USER_QUERY} from './User';

class GetMoney extends React.Component {
    totalItems = (cart) => {
        return cart.reduce((current, next) => current + next.quantity, 0);
    }

    onToken = (res) => {
        console.log(res);
    }

    render() {
        return (
            <User>
                {({data: {me}}) => (
                    <StripeCheckout
                        amount={calcTotalPrice(me.cart)}
                        name='Sick fits'
                        description={`Order of ${this.totalItems(me.cart)} items!`}
                        image={me.cart[0].item && me.cart[0].item.image}
                        stripeKey='pk_test_zNX8GHalH77LM7hKwSZMGj1D00XSHZBPry'
                        currency='USD'
                        email={me.email}
                        token={res => this.onToken(res)}
                    >
                        {this.props.children}
                    </StripeCheckout>
                )}
            </User>
        );
    }
}

export default GetMoney;