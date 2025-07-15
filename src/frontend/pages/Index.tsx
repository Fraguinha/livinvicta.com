import Navigation from "@/components/Navigation";
import ProjectCard from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Award, CheckCircle, Clock, Mail, MapPin, Phone, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Import images
import heroImage from "@/assets/hero.jpg";
import highlight1 from "@/assets/highlight1.jpg";
import highlight2 from "@/assets/highlight2.jpg";

const services = [
    {
        title: "Kitchen Renovations",
        description: "Transform your kitchen into a modern culinary masterpiece with custom cabinets, premium countertops, and state-of-the-art appliances.",
        icon: "🍳"
    },
    {
        title: "Bathroom Remodeling",
        description: "Create your dream bathroom with luxury finishes, modern fixtures, and spa-like amenities for the ultimate relaxation experience.",
        icon: "🛁"
    },
    {
        title: "Living Space Design",
        description: "Redesign your living areas with open concepts, built-in storage, and contemporary styling that reflects your lifestyle.",
        icon: "🏠"
    }
];

const stats = [
    { icon: Star, value: "100+", label: "Projects Completed" },
    { icon: Award, value: "15+", label: "Years Experience" },
    { icon: Clock, value: "98%", label: "On-Time Delivery" },
    { icon: Users, value: "30+", label: "Happy Clients" }
];

const Index = () => {
    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch("http://backend/api/featured-projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("API call failed");
                return res.json();
            })
            .then(data => {
                setFeaturedProjects(data);
                setLoading(false);
            })
            .catch(() => {
                setFeaturedProjects([]);
                setLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={heroImage}
                        alt="Beautiful renovated home interior"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-overlay-gradient"></div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                        Transform Your
                        <span className="block text-primary-glow">Dream Home</span>
                    </h1>
                    <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
                        Expert renovation services that bring your vision to life with craftsmanship, creativity, and attention to detail.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/portfolio">
                            <Button variant="hero" size="lg" className="text-lg px-8 py-6">
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
                            From concept to completion, we offer comprehensive renovation services tailored to your needs and budget.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <Card key={index} className="group hover:shadow-hover transition-all duration-300 transform hover:scale-105 bg-card-gradient">
                                <CardContent className="p-6 text-center">
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
                            Discover some of our most recent transformations and see the difference expert craftsmanship makes.
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">Loading featured projects...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {featuredProjects.map((project) => (
                                <ProjectCard key={project.id} {...project} />
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
                            <Button variant="cta" size="lg">
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
                                With over 15 years of experience, we've built a reputation for excellence, reliability, and customer satisfaction.
                            </p>

                            <div className="space-y-4">
                                {[
                                    "Licensed and insured professionals",
                                    "Transparent pricing with no hidden fees",
                                    "Quality materials and expert craftsmanship",
                                    "On-time project completion guarantee",
                                    "Comprehensive warranty on all work",
                                    "Dedicated project management"
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
                                alt="Renovation highlight"
                                className="rounded-lg shadow-card h-48 w-full object-cover"
                            />
                            <img
                                src={highlight2}
                                alt="Renovation highlight"
                                className="rounded-lg shadow-card h-48 w-full object-cover mt-8"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-hero-gradient text-primary-foreground">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Start Your Renovation?
                    </h2>
                    <p className="text-xl mb-8 text-primary-foreground/90">
                        Let's discuss your project and create a space you'll love for years to come.
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
                            Ready to transform your space? Contact us today for a free consultation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Phone,
                                title: "Call Us",
                                content: "(+351) 123-456-789",
                                action: "tel:+351123456789"
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
                                content: "123 Renovation St, Porto, Portugal 4200-000",
                                action: "https://maps.app.goo.gl/Jntw7yQb2FEq5pGQ6"
                            }
                        ].map((contact, index) => (
                            <Card key={index} className="text-center hover:shadow-hover transition-all duration-300">
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
