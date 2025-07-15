import Navigation from "@/components/Navigation";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/context/ToastContext";
import { useFeaturedProjects } from "@/hooks/use-api";
import { ArrowRight, Award, CheckCircle, Clock, Mail, MapPin, Phone, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";

import heroImage from "@/assets/hero.jpg";
import highlight1 from "@/assets/highlight1.jpg";
import highlight2 from "@/assets/highlight2.jpg";

const services = [
    {
        title: "Property Buying Services",
        description: "Expert guidance to help you find and purchase your ideal property, from first homes to investment opportunities.",
        icon: "🏠"
    },
    {
        title: "Property Rental Services",
        description: "Find a home or tenant with our full-service property rental solutions for owners and renters.",
        icon: "🏢"
    },
    {
        title: "Property Selling Services",
        description: "Professional support to market and sell your property quickly and at the best price.",
        icon: "💼"
    },
    {
        title: "Remodeling Consulting",
        description: "Enhance your property’s value and appeal with expert remodeling and renovation services.",
        icon: "🛠️"
    },
    {
        title: "Rental Consulting",
        description: "Comprehensive advice for landlords and tenants, including property management and rental agreements.",
        icon: "📑"
    },
    {
        title: "General Consulting",
        description: "Personalized consulting for all your real estate needs.",
        icon: "📊"
    },
];

const stats = [
    { icon: Star, value: "100+", label: "Projects Completed" },
    { icon: Award, value: "15+", label: "Years Experience" },
    { icon: Clock, value: "98%", label: "On-Time Delivery" },
    { icon: Users, value: "100+", label: "Happy Clients" }
];

const Index = () => {
    const { toast } = useToast();
    const { data: featuredProjects = [], isLoading: loading, isError } = useFeaturedProjects();

    if (isError) {
        toast({ title: "Error", description: "Failed to load featured projects.", variant: "destructive" });
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={heroImage}
                        alt="Modern property interior"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                        Find the
                        <span className="block text-primary">Perfect Property</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
                        Real estate consulting services for buying, selling, renting, remodeling, and more. Your trusted partner in property.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/portfolio">
                            <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground">
                                View Portfolio
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-secondary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <stat.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                                <div className="text-3xl font-bold text-secondary-foreground mb-2">{stat.value}</div>
                                <div className="text-muted-foreground">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                            Our Services
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            From buying and selling to renting and remodeling, we offer comprehensive real estate services tailored to your needs and budget.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <Card
                                key={index}
                                className="rounded-lg border bg-card text-card-foreground shadow-sm text-center"
                            >
                                <CardContent className="p-6">
                                    <div className="text-4xl mb-4">{service.icon}</div>
                                    <h3 className="font-semibold text-lg mb-3 text-card-foreground">{service.title}</h3>
                                    <p className="text-muted-foreground text-sm">{service.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Projects */}
            <section className="py-20 bg-muted/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                            Featured Projects
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Discover some of our best work and see the difference expert craftsmanship makes.
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Loading featured projects...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {featuredProjects.map((project) => (
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

                    {featuredProjects.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No featured projects yet.</p>
                        </div>
                    )}

                    <div className="text-center">
                        <Link to="/portfolio">
                            <Button size="lg">
                                View All Projects
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                                Why Choose LivInvicta?
                            </h2>
                            <p className="text-xl text-muted-foreground mb-8">
                                With over 15 years of experience, we have built a reputation for excellence, reliability, and customer satisfaction.
                            </p>

                            <div className="space-y-4">
                                {[
                                    "Guidance for buying, selling, and renting",
                                    "Transparent and competitive pricing",
                                    "Personalized property consulting",
                                    "Comprehensive support at every step",
                                    "Trusted by clients for integrity and results"
                                ].map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                                        <span className="text-muted-foreground">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <img
                                src={highlight1}
                                alt="Property highlight"
                                className="rounded-lg shadow-card h-48 w-full object-cover"
                            />
                            <img
                                src={highlight2}
                                alt="Property highlight"
                                className="rounded-lg shadow-card h-48 w-full object-cover mt-8"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-primary text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-xl mb-8 text-white/90">
                        Let's discuss your property goals.
                    </p>
                    <Link to="/contact">
                        <Button variant="secondary" size="lg" className="text-lg px-8 py-6">
                            Contact Us
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                            Get In Touch
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Contact us today for a free consultation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Phone,
                                title: "Call Us",
                                content: "(+351) 932-338-504",
                                action: "tel:+351932338504"
                            },
                            {
                                icon: Mail,
                                title: "Email Us",
                                content: "info@livinvicta.com",
                                action: "mailto:info@livinvicta.com"
                            },
                            {
                                icon: MapPin,
                                title: "Visit Us",
                                content: "R. José Coutinho 423, 4465-181 São Mamede de Infesta",
                                action: "https://maps.app.goo.gl/YqfqB1VzR4pMghy19"
                            }
                        ].map((contact, index) => (
                            <Card key={index} className="text-center">
                                <CardContent className="p-8">
                                    <contact.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                                    <h3 className="font-semibold text-lg mb-2">{contact.title}</h3>
                                    <a
                                        href={contact.action}
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {contact.content}
                                    </a>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Index;
