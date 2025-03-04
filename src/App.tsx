import { HashRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

import { NotificationProvider } from "./services/context";
import Notification from "./components/Notification";
import AnimeDetails from "./pages/AnimeDetails";
import NotFound from "./pages/NotFound";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import Navbar from "./layouts/Header";
import Search from "./pages/Search";
import Home from "./pages/Home";

const queryClient = new QueryClient();

const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <NotificationProvider>
                <Router>
                    <div className="min-h-screen">
                        <Navbar />
                        <Notification />
                        <main className="">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route
                                    path="/anime/:id"
                                    element={<AnimeDetails />}
                                />
                                <Route path="/search" element={<Search />} />
                                <Route
                                    path="/discover"
                                    element={<Discover />}
                                />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </main>
                    </div>
                </Router>
            </NotificationProvider>
        </QueryClientProvider>
    );
};
export default App;