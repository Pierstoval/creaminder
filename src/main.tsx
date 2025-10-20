import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router";
import Layout from "./Layout";
import Index from "./routes/Index";
import ActivityCreate from "./routes/ActivityCreate";


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <BrowserRouter>
        <Routes>
            <Route element={<Layout />}>
                <Route index element={<Index />} />
                <Route path="/" element={<Index />} />
                <Route path="/activity/create" element={<ActivityCreate />} />
            </Route>
        </Routes>
    </BrowserRouter>
);
