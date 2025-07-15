import Navigation from "@/components/Navigation";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { useToast } from "@/context/ToastContext";
import { useCategories, useProjects } from "@/hooks/use-api";
import type { Category } from "@/types/category";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Portfolio = () => {
    const { toast } = useToast();
    const [selectedCategory, setSelectedCategory] = useState<Category>("All");
    const { data: categoriesData = ["All"], isLoading: loadingCategories, isError: categoriesError } = useCategories();
    const { data: projectsData = [], isLoading: loadingProjects, isError: projectsError } = useProjects(selectedCategory);
    const categories = ["All", ...categoriesData.filter((c) => c !== "All")];
    const projects = projectsData;
    const loading = loadingCategories || loadingProjects;

    useEffect(() => {
        if (categoriesError) {
            toast({ title: "Error", description: "Failed to fetch categories.", variant: "destructive" });
        }
        if (projectsError) {
            toast({ title: "Error", description: "Failed to fetch projects.", variant: "destructive" });
        }
    }, [categoriesError, projectsError, toast]);

    const filteredProjects = selectedCategory === "All"
        ? projects
        : projects.filter(project => project.category === selectedCategory);

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <section className="pt-16 pb-8 bg-primary text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                        Our Portfolio
                    </h1>
                    <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
                        Explore what we have achieved for our clients. Each project tells a story of craftsmanship, creativity, and attention to detail.
                    </p>
                </div>
            </section>

            {/* Filter Section */}
            <section className="py-8 bg-background border-b border-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(category)}
                                className="mb-2"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Loading projects...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProjects.map((project) => (
                                <ProjectCard
                                    key={project.id}
                                    id={project.id}
                                    title={project.title}
                                    description={project.description}
                                    beforeImage={project.beforeImage || ""}
                                    afterImage={project.afterImage || ""}
                                    category={project.category}
                                    availability={project.availability || ""}
                                />
                            ))}
                        </div>
                    )}

                    {filteredProjects.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No projects in the selected category yet.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-secondary">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-secondary-foreground mb-6">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Let's discuss your property goals.
                    </p>
                    <Link to="/contact">
                        <Button variant="default" size="lg">
                            Contact Us
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Portfolio;
