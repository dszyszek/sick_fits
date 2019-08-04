import RequireSignIn from '../components/RequireSignIn';


const Permissions = props => (
    <div>
        <RequireSignIn>
            <p>Permissions</p>
        </RequireSignIn>
    </div>
);

export default Permissions;