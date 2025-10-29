import {NavLink, Outlet} from "react-router";
import {useTranslation} from "react-i18next";
import FlashMessages from './lib/components/messages/FlashMessages.tsx';

import "react-datepicker/dist/react-datepicker.css";
import "./App.css";

export default function Layout() {
    const {t, i18n} = useTranslation();

    function LocaleLink({locale, flag}: {locale: string; flag: string}) {
        return (
            <li className="right">
                <button type="button" className="nobg" onClick={() => i18n.changeLanguage(locale)}>
                    {flag}
                </button>
            </li>
        );
    }

    return (
        <main>
            <nav className="main">
                <ul>
                    <li><NavLink activeClassName="active" className="btn" to="/">{t('activities_title')}</NavLink></li>
                    <li><NavLink activeClassName="active" className="btn" to="/activity-type/list">{t('activity_types_title')}</NavLink></li>
                    <li><NavLink activeClassName="active" className="btn" to="/calendar">{t('calendar_title')}</NavLink></li>
                    {i18n.language == 'fr' || (<LocaleLink locale="fr" flag="🇫🇷" />)}
                    {i18n.language == 'en' || (<LocaleLink locale="en" flag="🇬🇧" />)}
                </ul>
            </nav>

            <FlashMessages />

            <Outlet/>
        </main>
    );
}
