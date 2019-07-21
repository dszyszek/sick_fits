import Link from 'next/link';


const Nav = props => (
    <div>
        <Link href='/'>
            <a>main</a>
        </Link>

        <Link href='/sell'>
            <a>sell</a>
        </Link>
    </div>
);

export default Nav;