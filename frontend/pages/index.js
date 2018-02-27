import Link from 'next/link'

const Index = () => (
    <div>
        <Link href="/map"><a>react map</a></Link>
        <br />
        <Link href="http://www.wpsimple.local/wp/"><a>wordpress main page</a></Link>
    </div>
)

Index.getInitialProps = async () => {
    return {}
}

export default Index
