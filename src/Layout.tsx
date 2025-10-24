import "./App.css";
import {Link, Outlet} from "react-router";

export default function Layout() {
    return(
        <main>
            <nav>
                <ul>
                    <li><Link to="/">Activities</Link></li>
                    <li><Link to="/activity-type/list">Activity types</Link></li>
                </ul>
            </nav>

            <Outlet />
        </main>
    );
}
