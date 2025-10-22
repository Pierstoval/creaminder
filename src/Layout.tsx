import "./App.css";
import {Outlet} from "react-router";
import Menu from './components/Menu';

export default function Layout() {
    return(
        <main>
            <Menu />
            <Outlet />
        </main>
    );
}
