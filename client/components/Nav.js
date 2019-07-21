import Link from 'next/link';


const Nav = props => (
    <div>
        <h1>_Nav_ component</h1>
        <Link href='/'>
            <a>main</a>
        </Link>

        <Link href='/sell'>
            <a>sell</a>
        </Link>
    </div>
);

export default Nav;