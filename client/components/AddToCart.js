import React from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';

class AddToCart extends React.Component {
    render() {
        const {id} = this.props;
        return <button>Add to cart</button>
    }
};

export default AddToCart;