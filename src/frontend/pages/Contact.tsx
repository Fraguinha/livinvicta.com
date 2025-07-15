import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/context/ToastContext";
import { useContactMutation } from "@/hooks/use-api";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";

const Contact = () => {
    const { toast } = useToast();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: ""
    });
    const contactMutation = useContactMutation();
    const loading = contactMutation.isPending;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        contactMutation.mutate(form, {
            onSuccess: () => {
                toast({ title: "Message sent!", description: "Message sent!" });
                setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
            },
            onError: () => {
                toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
            }
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navigation />

            {/* Hero Section */}
            <section className="pt-16 pb-8 bg-primary text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-6">
                        Contact Us
                    </h1>
                    <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
                        Our team is here for you
                    </p>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                        {/* Contact Information */}
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-foreground mb-6">
                                    Get In Touch
                                </h2>
                                <p className="text-muted-foreground text-lg mb-8">
                                    We would love to hear about your needs. Reach out to us using any of the methods below.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Phone className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                                        <a href="tel:+351932338504" className="text-muted-foreground hover:text-primary transition-colors">(+351) 932-338-504</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Mail className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Email</h3>
                                        <a href="mailto:info@livinvicta.com" className="text-muted-foreground hover:text-primary transition-colors">info@livinvicta.com</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <MapPin className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Address</h3>
                                        <a href="https://maps.app.goo.gl/YqfqB1VzR4pMghy19" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                            R. José Coutinho 423, <br />4465-181 São Mamede de Infesta
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                                        <Clock className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">Business Hours</h3>
                                        <p className="text-muted-foreground">
                                            Monday - Friday: 8:00 AM - 6:00 PM<br />
                                            Saturday: 9:00 AM - 4:00 PM<br />
                                            Sunday: Closed
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-card border border-border rounded-lg p-8">
                            <h3 className="text-2xl font-bold text-foreground mb-6">
                                Send us a message
                            </h3>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-foreground mb-2">
                                            First Name
                                        </label>
                                        <Input
                                            id="firstName"
                                            placeholder="John"
                                            className="w-full"
                                            value={form.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-foreground mb-2">
                                            Last Name
                                        </label>
                                        <Input
                                            id="lastName"
                                            placeholder="Doe"
                                            className="w-full"
                                            value={form.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                                        Email
                                    </label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john.doe@example.com"
                                        className="w-full"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                                        Phone (Optional)
                                    </label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="(+351) 123-456-789"
                                        className="w-full"
                                        value={form.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                                        Message
                                    </label>
                                    <Textarea
                                        id="message"
                                        placeholder="Tell us about your goals..."
                                        className="w-full"
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Sending..." : "Send Message"}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Contact;
