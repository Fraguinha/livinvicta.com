import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [authStatus, setAuthStatus] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        title: "",
        description: "",
        category: "",
        beforeImage: null as File | null,
        afterImage: null as File | null,
        galleryImages: [] as File[],
        features: [""],
        client: "",
        budget: "",
        duration: "",
        featured: false,
    });

    const [categories, setCategories] = useState<string[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(true);

    useEffect(() => {
        fetch("/api/auth/status", {
            method: "POST",
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                setIsAuthenticated(data.authenticated);
                setAuthStatus(true);
                if (!data.authenticated) {
                    navigate("/login");
                }
            })
            .catch(() => {
                setIsAuthenticated(false);
                setAuthStatus(true);
                navigate("/login");
            });
    }, [navigate]);

    useEffect(() => {
        fetch("/api/categories", {
            method: "POST",
        })
            .then(res => res.json())
            .then(data => {
                setCategories(data);
                setLoadingCategories(false);
            })
            .catch(() => setLoadingCategories(false));
    }, []);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (field: string, files: FileList | null) => {
        if (!files) return;

        if (field === "galleryImages") {
            setFormData(prev => ({ ...prev, [field]: Array.from(files) }));
        } else {
            setFormData(prev => ({ ...prev, [field]: files[0] }));
        }
    };

    const handleFeatureChange = (index: number, value: string) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.map((feature, i) => i === index ? value : feature)
        }));
    };

    const addFeature = () => {
        setFormData(prev => ({ ...prev, features: [...prev.features, ""] }));
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = new FormData();
        form.append("id", formData.id);
        form.append("title", formData.title);
        form.append("description", formData.description);
        form.append("category", formData.category);
        form.append("client", formData.client);
        form.append("budget", formData.budget);
        form.append("duration", formData.duration);
        form.append("featured", formData.featured ? "true" : "false");

        if (formData.beforeImage) {
            form.append("beforeImage", formData.beforeImage);
        }
        if (formData.afterImage) {
            form.append("afterImage", formData.afterImage);
        }
        formData.galleryImages.forEach((file) => {
            form.append("galleryImages", file);
        });
        formData.features.forEach((feature) => {
            form.append("features", feature);
        });

        try {
            const res = await fetch("/api/projects/create", {
                method: "POST",
                body: form,
                credentials: "include"
            });
            if (res.ok) {
                const data = await res.json();
                toast({
                    title: "Project Created",
                    description: "New project has been created successfully.",
                });
                if (data.id) {
                    navigate(`/project/${data.id}`);
                }
            } else {
                const data = await res.json();
                toast({
                    title: "Error",
                    description: data.error || "Failed to create project.",
                    variant: "destructive"
                });
            }
        } catch (err) {
            toast({
                title: "Network Error",
                description: "Could not connect to the server.",
                variant: "destructive"
            });
        }
    };

    if (!authStatus) {
        return <div>Checking authentication...</div>;
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Create New Project</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="id">Project ID</Label>
                                    <Input
                                        id="id"
                                        value={formData.id}
                                        onChange={(e) => handleInputChange("id", e.target.value)}
                                        placeholder="Enter unique project ID"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="title">Project Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange("title", e.target.value)}
                                        placeholder="Enter project title"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                    placeholder="Project description"
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => handleInputChange("category", value)}
                                        disabled={loadingCategories}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder={loadingCategories ? "Loading..." : "Select category"} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="client">Client</Label>
                                    <Input
                                        id="client"
                                        value={formData.client}
                                        onChange={(e) => handleInputChange("client", e.target.value)}
                                        placeholder="Client name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="budget">Budget</Label>
                                    <Input
                                        id="budget"
                                        value={formData.budget}
                                        onChange={(e) => handleInputChange("budget", e.target.value)}
                                        placeholder="e.g., 25,000 €"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duration</Label>
                                    <Input
                                        id="duration"
                                        value={formData.duration}
                                        onChange={(e) => handleInputChange("duration", e.target.value)}
                                        placeholder="e.g., 8 weeks"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="featured"
                                    checked={formData.featured}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: Boolean(checked) }))}
                                />
                                <Label htmlFor="featured">Featured Project</Label>
                            </div>

                            {/* Images */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="beforeImage">Before Image</Label>
                                    <Input
                                        id="beforeImage"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange("beforeImage", e.target.files)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="afterImage">After Image</Label>
                                    <Input
                                        id="afterImage"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange("afterImage", e.target.files)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="galleryImages">Gallery Images</Label>
                                <Input
                                    id="galleryImages"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleFileChange("galleryImages", e.target.files)}
                                />
                                <p className="text-sm text-muted-foreground">Select multiple images for the gallery</p>
                            </div>

                            {/* Features */}
                            <div className="space-y-4">
                                <Label>Key Features</Label>
                                {formData.features.map((feature, index) => (
                                    <div key={index} className="flex gap-2">
                                        <Input
                                            value={feature}
                                            onChange={(e) => handleFeatureChange(index, e.target.value)}
                                            placeholder="Enter feature"
                                        />
                                        {formData.features.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => removeFeature(index)}
                                            >
                                                Remove
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                <Button type="button" variant="outline" onClick={addFeature}>
                                    Add Feature
                                </Button>
                            </div>

                            <Button type="submit" className="w-full">
                                Create Project
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Admin;
