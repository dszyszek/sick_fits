import Link from 'next/link';


const Home = props => (
    <div>
        <h1>HELLO _MAIN_</h1>
        <Link href='/user'>
            <a>user dir</a>
        </Link>
    </div>
);

export default Home;