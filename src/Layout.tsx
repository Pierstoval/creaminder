import "./App.css";
import {Outlet} from "react-router";
import Menu from './components/Menu';

export default function Layout({ children }) {
    return(
        <main>
            <Menu />
            <hr />
            <Outlet />
            <hr />
            {children}
        </main>
    );
}
