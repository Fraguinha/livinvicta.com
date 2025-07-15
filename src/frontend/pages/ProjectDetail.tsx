import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjectDetail } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast-context";
import { ArrowLeft, Calendar, CheckCircle, ChevronLeft, ChevronRight, Home, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function useImageExistence(project: any) {
    const [beforeImageExists, setBeforeImageExists] = useState(false);
    const [afterImageExists, setAfterImageExists] = useState(false);

    useEffect(() => {
        setBeforeImageExists(!!project?.beforeImage);
        setAfterImageExists(!!project?.afterImage);
    }, [project?.beforeImage, project?.afterImage]);

    return { beforeImageExists, afterImageExists };
}

const ProjectDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { toast } = useToast();
    const { data: project, isLoading: loading, isError } = useProjectDetail(id);
    const [currentImage, setCurrentImage] = useState(0);
    const { beforeImageExists, afterImageExists } = useImageExistence(project);

    useEffect(() => {
        if (isError) {
            toast({ title: "Error", description: "Failed to fetch project details.", variant: "destructive" });
        }
    }, [isError, toast]);

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <p className="text-muted-foreground">Loading project details...</p>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
                    <Link to="/portfolio">
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Portfolio
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Header */}
            <section className="pt-8 pb-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/portfolio">
                        <Button variant="ghost" className="mb-6">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Portfolio
                        </Button>
                    </Link>

                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                                {project.category}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            {project.title}
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-4xl">
                            {project.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Before/After Slider */}
            {beforeImageExists && afterImageExists && (
                <section className="pb-16">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <BeforeAfterSlider
                            beforeImage={project.beforeImage}
                            afterImage={project.afterImage}
                            className="shadow-card"
                        />
                    </div>
                </section>
            )}

            {/* Project Gallery */}
            <section className="pb-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Project Gallery</h3>

                    {/* Main Image */}
                    <div className="relative mb-6">
                        <img
                            src={project.gallery?.[currentImage]}
                            alt={`${project.title} gallery ${currentImage + 1}`}
                            className="w-full h-96 object-cover rounded-lg shadow-card"
                        />

                        {/* Navigation Arrows */}
                        <button
                            onClick={() => setCurrentImage(currentImage === 0 ? (project.gallery?.length || 1) - 1 : currentImage - 1)}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-md transition-all duration-200"
                        >
                            <ChevronLeft className="h-6 w-6 text-foreground" />
                        </button>

                        <button
                            onClick={() => setCurrentImage(currentImage === (project.gallery?.length || 1) - 1 ? 0 : currentImage + 1)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background p-2 rounded-full shadow-md transition-all duration-200"
                        >
                            <ChevronRight className="h-6 w-6 text-foreground" />
                        </button>
                    </div>

                    {/* Thumbnail Selection */}
                    <div className="flex justify-center gap-3">
                        {project.gallery?.map((image: string, index: number) => (
                            <button
                                key={index}
                                onClick={() => setCurrentImage(index)}
                                className={`relative overflow-hidden rounded-lg transition-all duration-200 ${currentImage === index
                                        ? 'ring-2 ring-primary shadow-lg scale-105'
                                        : 'hover:scale-105 opacity-70 hover:opacity-100'
                                    }`}
                            >
                                <img
                                    src={image}
                                    alt={`Gallery thumbnail ${index + 1}`}
                                    className="w-20 h-20 object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Project Details */}
            <section className="pb-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Project Info */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Features */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        Key Features
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {project.features.map((feature: string, index: number) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                                <span className="text-muted-foreground">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">

                            {/* Project Stats */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Project Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-4 w-4 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Location</p>
                                            <p className="font-medium">{project.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Home className="h-4 w-4 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Price</p>
                                            <p className="font-medium">{project.price}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-primary" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Availability</p>
                                            <p className="font-medium">{project.availability}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* CTA */}
                            <Card className="bg-hero-gradient text-white">
                                <CardContent className="p-6 text-center">
                                    <h3 className="font-semibold text-lg mb-3">
                                        Interested?
                                    </h3>
                                    <p className="mb-4 text-sm">
                                        Let's talk about it
                                    </p>
                                    <Link to="/contact">
                                        <Button variant="secondary" className="w-full">
                                            Contact Us
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProjectDetail;
