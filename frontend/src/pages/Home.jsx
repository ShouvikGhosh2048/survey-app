import { Link } from "react-router-dom"

const Home = () => {
    return (
        <div className="homePage">
            <p>Home</p>
            <div className="homePageLinks">
                <Link to="/open-surveys">Open surveys</Link>
                <Link to="/closed-surveys">Closed surveys</Link>
            </div>
        </div>
    )
}

export default Home