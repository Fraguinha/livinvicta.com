import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();
    const isAuthenticated = !!user;

    const navItems = [
        ...(isAuthenticated && user?.role === "admin"
            ? [{ href: "/admin", label: "Admin" }]
            : []
        ),
        { href: "/", label: "Home" },
        { href: "/portfolio", label: "Portfolio" },
        { href: "/contact", label: "Contact" },
        ...(!isAuthenticated ? [{ href: "/login", label: "Login" }] : []),
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                        <span className="text-foreground">LivInvicta</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navItems.map((item, idx) => (
                            <Link
                                key={item.href}
                                to={item.href}
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary relative",
                                    isActive(item.href)
                                        ? "text-primary after:absolute after:bottom-[-20px] after:left-0 after:w-full after:h-0.5 after:bg-primary after:text-white"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                        {isAuthenticated && (
                            <Link
                                to={location.pathname} // Stay on current page
                                className={cn(
                                    "text-sm font-medium transition-colors hover:text-primary relative",
                                    "text-muted-foreground"
                                )}
                                onClick={logout}
                            >
                                Logout
                            </Link>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="md:hidden pb-4">
                        <div className="flex flex-col gap-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary px-2 py-1",
                                        isActive(item.href) ? "text-primary" : "text-muted-foreground"
                                    )}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item.label}
                                </Link>
                            ))}
                            {isAuthenticated && (
                                <Link
                                    to={location.pathname}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary px-2 py-1",
                                        "text-muted-foreground"
                                    )}
                                    onClick={() => { setIsOpen(false); logout(); }}
                                >
                                    Logout
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
