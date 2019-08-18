import React, { Component } from 'react';
import formatMoney from '../lib/formatMoney';
import styled from 'styled-components';

const CartItemStyled = styled.li``;

const CartItem = props => {
    return (
        <CartItemStyled>
            {props.item.id}
        </CartItemStyled>
    );
};

export default CartItem;
