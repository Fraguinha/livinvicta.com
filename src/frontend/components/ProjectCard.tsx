import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ProjectCardProps {
    id: string;
    title: string;
    description: string;
    beforeImage: string;
    afterImage: string;
    category: string;
    duration: string;
}

const ProjectCard = ({ id, title, description, beforeImage, afterImage, category, duration }: ProjectCardProps) => {
    return (
        <Card className="group overflow-hidden bg-card-gradient border-border hover:shadow-hover transition-all duration-300 transform hover:scale-105">
            <div className="relative">
                <BeforeAfterSlider
                    beforeImage={beforeImage}
                    afterImage={afterImage}
                    className="aspect-[4/3]"
                />
                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium">
                    {category}
                </div>
            </div>

            <CardContent className="p-6">
                <div className="mb-3">
                    <h3 className="font-semibold text-lg text-card-foreground mb-2">{title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span>Duration: {duration}</span>
                    </div>
                </div>

                <Link to={`/project/${id}`}>
                    <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary">
                        View Details
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
};

export default ProjectCard;
