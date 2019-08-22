import React from 'react';
import Downshift from 'downshift';
import Router from 'newxt/router';
import {ApolloConsumer} from 'react-adopt';
import gql from 'graphql-tag';
import debounce from 'lodash.debounce';
import {DropDown, DropDownItem, SearchStyles} from './styles/DropDown';


class AutoComplete extends React.Component {
    render() {
        <SearchStyles>
            <div>
                <input type='search' />
                <DropDown>
                    <p>Items here</p>
                </DropDown>
            </div>
        </SearchStyles>
    }
}

export default AutoComplete;