import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router";
import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import en from './translations/en.json';
import fr from './translations/fr.json';

import Layout from "./Layout";
import ActivityList from "./routes/ActivityList.tsx";
import ActivityCreate from "./routes/ActivityCreate";
import ActivityTypeCreate from "./routes/ActivityTypeCreate.tsx";
import {ActivityTypeList} from "./routes/ActivityTypeList.tsx";
import ActivityTypeEdit from "./routes/ActivityTypeEdit.tsx";
import ActivityEdit from "./routes/ActivityEdit.tsx";

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        // the translations
        // (tip move them in a JSON file and import them,
        // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
        resources: {
            en: {
                translation: en
            },
            fr: {
                translation: fr
            }
        },
        fallbackLng: "en",
        interpolation: {escapeValue: false}
    });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<ActivityList />} />
                <Route path="/activity/list" element={<ActivityList />} />
                <Route path="/activity/create" element={<ActivityCreate />} />
                <Route path="/activity/edit/:id" element={<ActivityEdit />} />
                <Route path="/activity-type/list" element={<ActivityTypeList />} />
                <Route path="/activity-type/create" element={<ActivityTypeCreate />} />
                <Route path="/activity-type/edit/:id" element={<ActivityTypeEdit />} />
            </Route>
        </Routes>
    </BrowserRouter>
);
