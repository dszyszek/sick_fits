import RequireSignIn from '../components/RequireSignIn';


const Sell = props => (
    <div>
        <RequireSignIn>
            <p>Single order page</p>
        </RequireSignIn>
    </div>
);

export default Sell;