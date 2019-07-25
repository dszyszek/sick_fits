import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';

import Title from './styles/Title';
import ItemStyles from './styles/ItemStyles';
import PriceTag from './styles/PriceTag';


class Item extends Component {
    render() {
        const {item} = this.props;

        return (
            <ItemStyles>
                <Title>
                    <Link href={{
                        pathname: '/item',
                        query: {id: item.id}
                    }}>
                        <a>{item.title}</a>
                    </Link>

                </Title>
            </ItemStyles>
        );
    }
}

Item.propTypes = {
    item: PropTypes.object.isRequired
};

export default Item;