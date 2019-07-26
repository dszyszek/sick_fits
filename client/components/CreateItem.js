import React, { Component } from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';

import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';


const CREATE_ITEM_MUTATION = gql`
    mutation CREATE_ITEM_MUTATION(
        $title: String!
        $description: String!
        $price: Int!
        $image: String
        $largeImage: String
    ) {
        createItem(
            title: $title
            description: $description
            price: $price
            image: $image
            largeImage: $largeImage
        ) {
            id
        }
    }
`;

class CreateItem extends Component {
    state = {
        title: '',
        description: '',
        image: '',
        largeImage: '',
        price: ''
    };

    updateValue = (e) => {
        const {name, type, value} = e.target;
        const val = type === 'number' ? parseFloat(value) : value;
        this.setState({
            [name]: val
        });
    } 

    render() {
        return (
            <Mutation 
                mutation={CREATE_ITEM_MUTATION}
                variables={this.state}
            >
                {(createItem, {loading, error}) => (

                    <Form onSubmit={async e => {
                        e.preventDefault();
                        const res = await createItem();
                        
                    }}>
                        <Error error={error} />
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor='title'>
                            Title
                            
                            <input 
                            type='text' 
                            id='title' 
                            name='title' 
                            placeholder='Title' 
                            required 
                            value={this.state.title} 
                            onChange={this.updateValue}
                            />
                            </label>
                            
                            <label htmlFor='price'>
                            Price
                            <input 
                            type='number' 
                            id='price' 
                            name='price' 
                            placeholder='Price' 
                            required 
                            value={this.state.price} 
                            onChange={this.updateValue}
                            />
                            
                            </label>
                            
                            <label htmlFor='description'>
                            Description   
                            <textarea 
                            id='description' 
                            name='description' 
                            placeholder='Type in some description' 
                            required 
                                    value={this.state.description} 
                                    onChange={this.updateValue}
                                    />
                            </label>
                            <button type='submit'>Submit</button>
                        
                        </fieldset>
                    </Form>
                )}
            </Mutation>
                            );
                        }
                    }
                    
                    export default CreateItem;
                    export {CREATE_ITEM_MUTATION};
                    