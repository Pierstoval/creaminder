// @ts-ignore : this import is apparently no longer necessary, but it's still kept for IDE compatibility.
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
import ActivityTypeList from "./routes/ActivityTypeList.tsx";
import ActivityTypeEdit from "./routes/ActivityTypeEdit.tsx";
import ActivityEdit from "./routes/ActivityEdit.tsx";
import Calendar from "./routes/Calendar.tsx";

i18n
    .use(initReactI18next)
    .init({
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
                <Route path="/calendar" element={<Calendar />} />
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
