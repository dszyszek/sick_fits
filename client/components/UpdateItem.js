import React, { Component } from 'react';
import {Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';

import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';


const UPDATE_ITEM_MUTATION = gql`
    mutation UPDATE_ITEM_MUTATION(
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

class UpdateItem extends Component {
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

    uploadFile = async e => {
        console.log('uploading file...');
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'sickfits');

        const res = await fetch('https://api.cloudinary.com/v1_1/dszyszek/image/upload', {
            method: 'POST',
            body: data
        });

        const file = await res.json();

        this.setState({
            image: file.secure_url,
            largeImage: file.eager[0].secure_url
        });
    }

    render() {
        return (
            <Mutation 
                mutation={UPDATE_ITEM_MUTATION}
                variables={this.state}
            >
                {(createItem, {loading, error}) => (

                    <Form onSubmit={async e => {
                        e.preventDefault();
                        const res = await createItem();
                        Router.push({
                            pathname: '/item',
                            query: {id: res.data.createItem.id}
                        });
                    }}>
                        <Error error={error} />
                        <fieldset disabled={loading} aria-busy={loading}>
                            <label htmlFor='file'>
                                Image
                            
                                <input 
                                type='file' 
                                id='file' 
                                name='file' 
                                placeholder='Upload an image' 
                                required 
                                onChange={this.uploadFile}
                                />

                                {this.state.image && <img src={this.state.image} alt='Upload preview' width='200px' />}
                            </label>
                        
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
                    
export default UpdateItem;
export {UPDATE_ITEM_MUTATION};
                    