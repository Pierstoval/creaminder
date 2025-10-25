import "./App.css";
import {Link, Outlet} from "react-router";
import {useTranslation} from "react-i18next";

export default function Layout() {
    const {t, i18n} = useTranslation();

    function LocaleLink({locale, flag}) {
        return (
            <li className="right">
                <button type="button" className="nobg" href="#" onClick={() => i18n.changeLanguage(locale)}>
                    {flag} {locale.toUpperCase()}
                </button>
            </li>
        );
    }

    return (
        <main>
            <nav className="main">
                <ul>
                    <li><Link to="/">{t('activities_title')}</Link></li>
                    <li><Link to="/activity-type/list">{t('activity_types_title')}</Link></li>
                    {i18n.language == 'fr' || (<LocaleLink locale="fr" flag="🇫🇷" />)}
                    {i18n.language == 'en' || (<LocaleLink locale="en" flag="🇬🇧" />)}
                </ul>
            </nav>

            <Outlet/>
        </main>
    );
}
