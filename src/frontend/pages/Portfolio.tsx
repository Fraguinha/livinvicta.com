import Navigation from "@/components/Navigation";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Import images
const categories = ["All", "Kitchen", "Bathroom", "Living Room", "Bedroom"];

const Portfolio = () => {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch("http://backend/api/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ category: selectedCategory })
        })
            .then(res => {
                if (!res.ok) throw new Error("API call failed");
                return res.json();
            })
            .then(data => {
                setProjects(data);
                setLoading(false);
            })
            .catch(() => {
                setProjects([]);
                setLoading(false);
            });
    }, [selectedCategory]);

    const filteredProjects = selectedCategory === "All"
        ? projects
        : projects.filter(project => project.category === selectedCategory);

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <section className="pt-16 pb-8 bg-hero-gradient">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                        Our Portfolio
                    </h1>
                    <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
                        Discover the transformations we've created for our clients. Each project tells a story of craftsmanship, creativity, and attention to detail.
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
                                <ProjectCard key={project.id} {...project} />
                            ))}
                        </div>
                    )}

                    {filteredProjects.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No projects found for the selected category.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-secondary">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-secondary-foreground mb-6">
                        Ready to Transform Your Space?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Let's discuss your renovation project and create something amazing together.
                    </p>
                    <Link to="/contact">
                        <Button variant="cta" size="lg">
                            Contact Us
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Portfolio;
