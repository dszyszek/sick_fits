import React, { Component } from 'react';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';

import Table from './styles/Table';
import Error from './ErrorMessage';


const possiblePermissions = [
    "ADMIN",
    "USER",
    "ITEMCREATE",
    "ITEMUPDATE",
    "ITEMDELETE",
    "PERMISSIONUPDATE"
];

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
                        <h2>Manage permissions</h2>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    {possiblePermissions.map(permission => <th>{permission}</th>)}
                                    <th>-</th>
                                </tr>
                            </thead>
                            <tbody>
                               {data.users.map(user => user.name)}
                            </tbody>
                        </Table>
                    </div>
                );
            }}
        </Query>
    );
};


class User extends Component {
    render() {
        return (
            <tr>
                <td></td> 
            </tr>
        );
    }
}

export default Permissions;