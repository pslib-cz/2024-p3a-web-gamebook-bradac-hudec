import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./index.css";
import App from "./App.tsx";
import Location from "./Location.tsx";
import Upload from "./Upload.tsx";
import NicknameMenu from "./Menus/NicknameMenu.tsx";
import StatisticsMenu from "./Menus/StatisticsMenu.tsx";
import AdminMenu from "./Menus/AdminMenu.tsx";
import LoginMenu from "./Menus/LoginMenu.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/upload" element={<Upload />} />
                <Route path="/" element={<App />} />
                <Route path="/locations/:locationId" element={<Location />} />
                <Route path="/nickname" element={<NicknameMenu />} />
                <Route path="/statistics" element={<StatisticsMenu />} />
                <Route path="/login" element={<LoginMenu />} />
                <Route path="/admin" element={<AdminMenu />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);
