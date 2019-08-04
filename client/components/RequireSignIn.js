import {Query} from 'react-apollo';
import {CURRENT_USER_QUERY} from './User';
import SignIn from './Signin';
import Error from './ErrorMessage';

import React from 'react';

const RequireSignIn = props => {
    return (
        <Query query={CURRENT_USER_QUERY}>

            {({data, loading}) => {
                if (loading) return <div>Loading...</div>

                return (
                    <div>
                        {data.me ? props.children : (
                                    <div>
                                        <h2>Please sign in before continuing</h2>
                                        <SignIn />
                                    </div>
                                    )}
                    </div>
                    
                );
            }}

        </Query>
    );
};

export default RequireSignIn;