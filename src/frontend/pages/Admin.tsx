import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCategories, useProjects } from "@/hooks/use-api";
import { useAuth } from "@/hooks/use-auth";
import { useMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast-context";
import { apiFetch } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Category } from "@/types/category";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user, logout } = useAuth();
    const { isMobile } = useMobile();
    const [formData, setFormData] = useState({
        id: "",
        title: "",
        description: "",
        category: "",
        beforeImage: null as File | null,
        afterImage: null as File | null,
        galleryImages: [] as File[],
        features: [""],
        location: "",
        price: "",
        availability: "",
        featured: false,
    });

    const [selectedCategory, setSelectedCategory] = useState<Category>("All");
    const { data: categories = [], isLoading: loadingCategories, isError: categoriesError } = useCategories();
    const { data: projects = [], isLoading: loadingProjects, isError: projectsError, refetch: refetchProjects } = useProjects(selectedCategory);

    const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

    const [newCategoryName, setNewCategoryName] = useState("");
    const [editingCategoryName, setEditingCategoryName] = useState<string>("");
    const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

    const queryClient = useQueryClient();
    const deleteMutation = useMutation({
        mutationFn: (id: string) => apiFetch(`${API_ENDPOINTS.PROJECTS}/${id}`, {
            method: "DELETE",
            credentials: "include"
        }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', selectedCategory] });
            toast({ title: "Deleted", description: "Project deleted." });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to delete project.", variant: "destructive" });
        }
    });
    const createOrUpdateMutation = useMutation({
        mutationFn: async ({ url, method, form }: { url: string, method: string, form: FormData }) => {
            return apiFetch(url, { method, body: form, credentials: "include" });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects', selectedCategory] });
            toast({ title: editingProjectId ? "Project Updated" : "Project Created", description: editingProjectId ? "Project has been updated successfully." : "New project has been created successfully." });
            setEditingProjectId(null);
            setFormData({
                id: "",
                title: "",
                description: "",
                category: "",
                beforeImage: null,
                afterImage: null,
                galleryImages: [],
                features: [""],
                location: "",
                price: "",
                availability: "",
                featured: false,
            });
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to save project.", variant: "destructive" });
        }
    });
    const createCategoryMutation = useMutation({
        mutationFn: async (name: string) => {
            return apiFetch(API_ENDPOINTS.CATEGORIES_CREATE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
                credentials: "include"
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast({ title: "Category Created", description: "New category has been created successfully." });
            setNewCategoryName("");
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to create category.", variant: "destructive" });
        }
    });
    const deleteCategoryMutation = useMutation({
        mutationFn: async (name: string) => {
            return apiFetch(API_ENDPOINTS.CATEGORIES_DELETE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
                credentials: "include"
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast({ title: "Category Deleted", description: "Category has been deleted." });
            setEditingCategoryId(null);
            setEditingCategoryName("");
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to delete category.", variant: "destructive" });
        }
    });
    const updateCategoryMutation = useMutation({
        mutationFn: async ({ oldName, newName }: { oldName: string, newName: string }) => {
            return apiFetch(API_ENDPOINTS.CATEGORIES_UPDATE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ oldName, newName }),
                credentials: "include"
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast({ title: "Category Updated", description: "Category name updated." });
            setEditingCategoryId(null);
            setEditingCategoryName("");
        },
        onError: () => {
            toast({ title: "Error", description: "Failed to update category.", variant: "destructive" });
        }
    });

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else if (user.role !== "admin") {
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (categoriesError) {
            toast({ title: "Error", description: "Failed to fetch categories.", variant: "destructive" });
        }
        if (projectsError) {
            toast({ title: "Error", description: "Failed to fetch projects.", variant: "destructive" });
        }
    }, [categoriesError, projectsError, toast]);

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

    const handleDelete = async (id: string) => {
        setPendingDeleteId(id);
        setShowDeleteModal(true);
        if (editingProjectId === id) {
            setEditingProjectId(null);
            setFormData({
                id: "",
                title: "",
                description: "",
                category: "",
                beforeImage: null,
                afterImage: null,
                galleryImages: [],
                features: [""],
                location: "",
                price: "",
                availability: "",
                featured: false,
            });
        }
    };

    const confirmDelete = async () => {
        if (!pendingDeleteId) return;
        deleteMutation.mutate(pendingDeleteId);
        setShowDeleteModal(false);
        setPendingDeleteId(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setPendingDeleteId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const form = new FormData();
        form.append("id", formData.id);
        form.append("title", formData.title);
        form.append("description", formData.description);
        form.append("category", formData.category);
        form.append("location", formData.location);
        form.append("price", formData.price);
        form.append("availability", formData.availability);
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

        const url = editingProjectId ? `${API_ENDPOINTS.PROJECTS}/${editingProjectId}` : `${API_ENDPOINTS.PROJECTS}/create`;
        const method = editingProjectId ? "PUT" : "POST";
        createOrUpdateMutation.mutate({ url, method, form });
    };

    const handleCategorySelect = (name: string) => {
        setEditingCategoryId(name);
        setEditingCategoryName(name);
    };

    const handleCategoryFormChange = (value: string) => {
        setEditingCategoryName(value);
    };

    const handleCategoryFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategoryName.trim()) return;
        if (editingCategoryId) {
            await updateCategoryMutation.mutateAsync({ oldName: editingCategoryId, newName: editingCategoryName.trim() });
        } else {
            await createCategoryMutation.mutateAsync(editingCategoryName.trim());
        }
        setEditingCategoryId(null);
        setEditingCategoryName("");
    };

    const handleCategoryDelete = async () => {
        if (!editingCategoryId) return;
        await deleteCategoryMutation.mutateAsync(editingCategoryId);
        setEditingCategoryId(null);
        setEditingCategoryName("");
    };

    if (!user) {
        return <div>Checking authentication...</div>;
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="p-8 max-w-4xl mx-auto space-y-8">
                {/* Categories List Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Existing Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul>
                            {categories.map((cat) => (
                                <li
                                    key={cat}
                                    className={`flex items-center mb-2 cursor-pointer rounded px-2 py-1 transition-colors ${editingCategoryId === cat ? "bg-primary/10 border border-primary font-semibold" : "hover:bg-muted"}`}
                                    onClick={() => {
                                        if (editingCategoryId === cat) {
                                            setEditingCategoryId(null);
                                            setEditingCategoryName("");
                                        } else {
                                            setEditingCategoryId(cat);
                                            setEditingCategoryName(cat);
                                        }
                                    }}
                                >
                                    <span className="flex-1">{cat}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {/* Category Form Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">{editingCategoryId ? "Edit Category" : "Create New Category"}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCategoryFormSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="categoryName">Category Name</Label>
                                <Input
                                    id="categoryName"
                                    value={editingCategoryName}
                                    onChange={(e) => setEditingCategoryName(e.target.value)}
                                    placeholder="Enter category name"
                                    required
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button type="submit" className="w-full" disabled={createCategoryMutation.status === 'pending' || updateCategoryMutation.status === 'pending'}>
                                    {editingCategoryId
                                        ? (updateCategoryMutation.status === 'pending' ? "Updating..." : "Update Category")
                                        : (createCategoryMutation.status === 'pending' ? "Creating..." : "Create Category")}
                                </Button>
                                {editingCategoryId && (
                                    <Button type="button" variant="destructive" className="w-full" onClick={handleCategoryDelete} disabled={deleteCategoryMutation.status === 'pending'}>
                                        {deleteCategoryMutation.status === 'pending' ? "Deleting..." : "Delete Category"}
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Projects List Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Existing Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul>
                            {projects.map(project => {
                                const isSelected = editingProjectId === project.id;
                                return (
                                    <li
                                        key={project.id}
                                        className={`flex items-center mb-2 cursor-pointer rounded px-2 py-1 transition-colors ${
                                            isSelected
                                                ? "bg-primary/10 border border-primary font-semibold"
                                                : "hover:bg-muted"
                                        }`}
                                        onClick={() => {
                                            if (isSelected) {
                                                setEditingProjectId(null);
                                                setFormData({
                                                    id: "",
                                                    title: "",
                                                    description: "",
                                                    category: "",
                                                    beforeImage: null,
                                                    afterImage: null,
                                                    galleryImages: [],
                                                    features: [""],
                                                    location: "",
                                                    price: "",
                                                    availability: "",
                                                    featured: false,
                                                });
                                            } else {
                                                setFormData({
                                                    id: project.id || "",
                                                    title: project.title || "",
                                                    description: project.description || "",
                                                    category: project.category || "",
                                                    beforeImage: null,
                                                    afterImage: null,
                                                    galleryImages: [],
                                                    features: project.features || [""],
                                                    location: project.location || "",
                                                    price: project.price || "",
                                                    availability: project.availability || "",
                                                    featured: !!project.featured,
                                                });
                                                setEditingProjectId(project.id);
                                            }
                                        }}
                                    >
                                        <span className="flex-1">{project.title} ({project.id})</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </CardContent>
                </Card>
                {/* Project Form Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            {editingProjectId ? "Edit Project" : "Create New Project"}
                        </CardTitle>
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
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange("location", e.target.value)}
                                        placeholder="e.g., Porto, Portugal"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input
                                        id="price"
                                        value={formData.price}
                                        onChange={(e) => handleInputChange("price", e.target.value)}
                                        placeholder="e.g., 350,000 €"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="availability">Availability</Label>
                                    <Input
                                        id="availability"
                                        value={formData.availability}
                                        onChange={(e) => handleInputChange("availability", e.target.value)}
                                        placeholder="e.g., Available, Booked, Rented"
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
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="afterImage">After Image</Label>
                                    <Input
                                        id="afterImage"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange("afterImage", e.target.files)}
                                    />
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground">You must either select both images, or leave them both empty</p>
                            <div className="space-y-2">
                                <Label htmlFor="galleryImages">Gallery Images</Label>
                                <Input
                                    id="galleryImages"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleFileChange("galleryImages", e.target.files)}
                                    required={!editingProjectId}
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

                            {editingProjectId ? (
                                <div className="flex gap-2 mt-2">
                                    <Button type="submit" className="w-full">
                                        Update Project
                                    </Button>
                                    <Button
                                        type="button"
                                        className="w-full"
                                        variant="destructive"
                                        onClick={() => handleDelete(editingProjectId)}
                                    >
                                        Delete Project
                                    </Button>
                                </div>
                            ) : (
                                <Button type="submit" className="w-full">
                                    Create Project
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
                        <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                        <p className="mb-6">Are you sure you want to delete this project?</p>
                        <div className="flex gap-2 justify-end">
                            <Button variant="outline" onClick={cancelDelete}>Cancel</Button>
                            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
