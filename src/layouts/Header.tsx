import { Link, useLocation } from "react-router-dom";
import { Film } from 'lucide-react';
import React, { useState } from "react";

const NAV_ITEMS = [
    { path: "/home", label: "Home" },
    { path: "/search", label: "Search" },
    { path: "/discover", label: "Discover" },
    { path: "/profile", label: "Profile" },
];

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const isActivePath = (path: string) => {
        return location.pathname === path;
    };

    const renderNavLink = (path: string, label: string, isMobile: boolean = false) => {
        const baseStyles = isMobile
            ? "block px-3 py-2 rounded-md text-base font-medium"
            : "";
        
        return (
            <Link
                key={path}
                to={path}
                className={`${baseStyles} ${
                    isActivePath(path)
                        ? "text-primary"
                        : "text-muted-foreground"
                } hover:${isMobile ? "bg-accent" : ""} hover:text-primary transition-colors`}
            >
                {label}
            </Link>
        );
    };

    return (
        <nav className="border-b bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link
                            to="/home"
                            className="flex gap-4 items-center text-2xl font-bold text-foreground hover:text-primary transition-colors"
                        >
                            <Film className="h-6 w-6 text-primary" />
                            <span className="text-2xl font-bold">AnimeHub</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex md:items-center md:space-x-10">
                        {NAV_ITEMS.map(({ path, label }) => renderNavLink(path, label))}
                    </div>

                    <div className="flex items-center md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="p-2 rounded-xl text-muted-foreground hover:bg-accent transition-colors focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                {isOpen ? (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                ) : (
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4 6h16M4 12h16m-7 6h7"
                                    />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`md:hidden transition-all duration-200 ease-in-out ${
                    isOpen
                        ? "max-h-64 opacity-100"
                        : "max-h-0 opacity-0 overflow-hidden"
                }`}
            >
                <div className="px-2 pt-2 pb-3 space-y-1">
                    {NAV_ITEMS.map(({ path, label }) => renderNavLink(path, label, true))}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;