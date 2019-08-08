import React, { Component } from 'react';
import {Query, Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import Table from './styles/Table';
import SickButton from './styles/SickButton';
import Error from './ErrorMessage';


const possiblePermissions = [
    "ADMIN",
    "USER",
    "ITEMCREATE",
    "ITEMUPDATE",
    "ITEMDELETE",
    "PERMISSIONUPDATE"
];

const UPDATE_PERMISSIONS_MUTATION = gql`
    mutation updatePermissions($permissions: [Permission], $userId: ID!) {
        updatePermissions(permissions: $permissions, userId: $userId) {
            id
            permissions
            name
            email
        }
    }
`;

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
                                    {possiblePermissions.map((permission, i) => <th key={i}>{permission}</th>)}
                                    <th>-</th>
                                </tr>
                            </thead>
                            <tbody>
                               {data.users.map((user, i) => <UserPermissions key={i} user={user} />)}
                            </tbody>
                        </Table>
                    </div>
                );
            }}
        </Query>
    );
};


class UserPermissions extends Component {
    static propTypes = {
        user: PropTypes.shape({
            name: PropTypes.string,
            permissions: PropTypes.array,
            email: PropTypes.string,
            id: PropTypes.string
        }).isRequired
    };

    state = {
        permissions: this.props.user.permissions
    };

    handlePermissionChange = (e) => {
        const checkbox = e.target;
        let updatedPermissions = [...this.state.permissions];

        if (checkbox.checked) {
            updatedPermissions.push(checkbox.value);
        } else {
            updatedPermissions = updatedPermissions.filter(x => x !== checkbox.value);
        }

        this.setState({
            permissions: updatedPermissions
        });
    };

    render() {
        const user = this.props.user;
        return (
            <Mutation 
                mutation={UPDATE_PERMISSIONS_MUTATION}
                variables={{
                    permissions: this.state.permissions,
                    userId: this.props.user.id
                }} 
            >
                {(updatePermissions, {loading, error, called}) => {
                    
                    return (
                        <>
                            {error && <tr><td colSpan='8'><Error error={error} /></td></tr>}
                            {!error && !loading && called && <tr><td colSpan='8'><span style={{color: 'red'}}>Successfully updated!</span></td></tr>}
                            <tr>
                            <td>{user.name}</td> 
                            <td>{user.email}</td> 
                            {possiblePermissions.map((permission, i) => (
                                <td key={i}>
                                <label htmlFor={`${user.id} - permission - ${permission}`}>
                                <input 
                                id={`${user.id} - permission - ${permission}`}
                                type="checkbox" 
                                checked={this.state.permissions.includes(permission)} 
                                value={permission}
                                            onChange={this.handlePermissionChange}
                                            />
                                            </label>
                                            </td>
                                            )
                                            )}
                                            <td>
                                            <SickButton
                                            type='button'
                                            disabled={loading}
                                            onClick={updatePermissions}
                                            >
                                            Updat{loading ? 'ing' : 'e'}
                                            </SickButton>
                                            </td>
                                            </tr>
                            </>
                            );
                        }
                }

            </Mutation>

        );
    }
}

export default Permissions;