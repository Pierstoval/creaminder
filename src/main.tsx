import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router";
import Layout from "./Layout";
import ActivityList from "./routes/ActivityList.tsx";
import ActivityCreate from "./routes/ActivityCreate";
import ActivityTypeCreate from "./routes/ActivityTypeCreate.tsx";
import ActivityTypeList from "./routes/ActivityTypeList.tsx";
import ActivityTypeEdit from "./routes/ActivityTypeEdit.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<ActivityList />} />
                <Route path="/" element={<ActivityList />} />
                <Route path="/activity/create" element={<ActivityCreate />} />
                <Route path="/activity-type/list" element={<ActivityTypeList />} />
                <Route path="/activity-type/create" element={<ActivityTypeCreate />} />
                <Route path="/activity-type/edit/:id" element={<ActivityTypeEdit />} />
            </Route>
        </Routes>
    </BrowserRouter>
);
