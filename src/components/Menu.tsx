import { Link, NavLink } from "react-router";

export default function Menu () {
    return <nav>
        <ul>
            <li>
                <Link to="/">Accueil</Link>
            </li>
            <li>
                <Link to="/activity/create">Nouvelle activité</Link>
            </li>
        </ul>
    </nav>
}
