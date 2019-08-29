import React, { Component } from 'react';

class Order extends Component {
    render() {
        return (
            <p>
                Single order page! {this.props.id}
            </p>
        );
    }
}

export default Order;