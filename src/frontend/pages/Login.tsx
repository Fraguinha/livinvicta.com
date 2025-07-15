import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast-context";
import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { User } from "@/types/user";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { login } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res: { success: boolean; error?: string; user?: User } = await apiFetch(API_ENDPOINTS.LOGIN, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(formData)
            });
            if (res.success && res.user) {
                login(res.user);
                toast({
                    title: "Login Successful",
                    description: "You are now logged in.",
                });
                navigate("/");
            } else {
                toast({
                    title: "Login Failed",
                    description: res.error || "Invalid credentials.",
                    variant: "destructive"
                });
            }
        } catch (err) {
            toast({
                title: "Login Error",
                description: "Could not connect to the server.",
                variant: "destructive"
            });
        }
    };

    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-background flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl">Login</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange("email", e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={formData.password}
                                            onChange={(e) => handleInputChange("password", e.target.value)}
                                            placeholder="Enter your password"
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                <Button type="submit" className="w-full">
                                    Login
                                </Button>
                            </form>
                            <div className="flex flex-col gap-4 mt-6">
                                <Button
                                    variant="outline"
                                    onClick={() => window.location.href = "/api/auth/google"}
                                    className="w-full"
                                >
                                    Login with Google
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default Login;
