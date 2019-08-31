import React, { Component } from 'react';
import {Query} from 'react-apollo';
import Link from 'next/link';
import styled from 'styled-components';
import gql from 'graphql-tag';

import formatMoney from '../lib/formatMoney';
import OrderItemStyles from './styles/OrderItemStyles';
import Error from './ErrorMessage';


const USER_ORDERS_QUERY = gql`
    query USER_ORDERS_QUERY {
        orders(orderBy: createdAt_DESC) {
            id
            total
            createdAt
            items {
                id 
                title
                price
                description
                quantity
                image
            }
        }
    }
`;

const OrderUl = styled.ul`
    display: grid;
    grid-gap: 4rem;
    grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

class OrderList extends Component {
    render() {
        return (
            <Query query={USER_ORDERS_QUERY}>
                {({data, loading, error}) => {
                    if (loading) return <p>Loading...</p>
                    if (error) return <Error error={error} />

                    return (
                        <OrderUl>
                            {data.orders.map(order => (
                                <OrderItemStyles key={order.id}>
                                    <Link href={{
                                            pathname: '/order',
                                            query: {id: order.id}
                                        }}
                                    > 
                                        <a>
                                            <div className='order-meta'>
                                                <p>{order.items.reduce((a, b) => a + b.quantity, 0)} Items</p>
                                                <p>{order.items.length} Product{order.items.length === 1 ? null : 's'}</p>
                                                <p>{formatMoney(order.total)}</p>
                                            </div>
                                            <div className='images'>
                                                {order.items.map(item => (
                                                    <img key={item.id} src={item.image} alt={item.title} />
                                                ))}
                                            </div>
                                        </a>
                                    </Link>
                                </OrderItemStyles>
                            ))}
                        </OrderUl>
                    );
                }}
            </Query>
        );
    }
}

export default OrderList;