import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Query} from 'react-apollo';
import Head from 'next/head';
import gql from 'graphql-tag';

import Error from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';
import formatMoney from '../lib/formatMoney';


const SINGLE_ORDER_QUERY = gql`
    query SINGLE_ORDER_QUERY($id: ID!) {
        order(id: $id) {
            id,
            items {
                id
                title
                description,
                price,
                image,
                quantity
            },
            total,
            user {
                id
            },
            charge,
            createdAt
        }
    }
`;

class Order extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired
    };
 
    render() {
        return (
            <Query 
                query={SINGLE_ORDER_QUERY} 
                variables={{id: this.props.id}}
            >
                {({data, error, loading}) => {
                    if (error) return <Error error={error} />
                    if (loading) return <p>Loading...</p>

                    const order = data.order;

                    return (
                        <OrderStyles>
                            <Head>
                                <title>Sick fits - Order {order.id}</title>
                            </Head>

                            <p>
                                <span>Order ID:</span>
                                <span>{this.props.id}</span>
                            </p>

                            <p>
                                <span>Charge:</span>
                                <span>{order.charge}</span>
                            </p>

                            <p>
                                <span>Total:</span>
                                <span>{formatMoney(order.total)}</span>
                            </p>


                            <p>
                                <span>Item count:</span>
                                <span>{order.items.length}</span>
                            </p>

                            <div className='items'>
                                {order.items.map(item => (
                                    <div className='order-item' key={item.id}>
                                        {console.log(item.image)}
                                        <img src={item.image} alt={item.title} />
                                    </div>
                                ))}
                            </div>
                        </OrderStyles>
                    );
                }}

            </Query>
        );
    }
}

export default Order;