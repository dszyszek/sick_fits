import React from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';

import Error from './ErrorMessage';


const ALL_USERS_QUERY = gql`
    query {
        users {
            id
            name
            email
            permissions
        }
    }
`;


const Permissions = props => {
    return (
        <Query query={ALL_USERS_QUERY}>
            {({data, error, loading}) => {
                if (loading) return <div>Loading...</div>
                if (error) return <Error error={error} />

                return (
                    <div>
                        Permissions
                    </div>
                );
            }}
        </Query>
    );
};

export default Permissions;