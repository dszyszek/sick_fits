import Link from 'next/link';


const User = props => (
    <div>
        <h1>HELLO _USER_</h1>
        <Link href='/'>
            <a>main dir</a>
        </Link>
    </div>
);

export default User;