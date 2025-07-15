import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ProjectCardProps } from "@/types/project-card-props";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProjectCard = ({ id, title, description, beforeImage, afterImage, category, availability, gallery }: ProjectCardProps & { gallery?: string[] }) => {
    const [beforeImageExists, setBeforeImageExists] = useState(false);
    const [afterImageExists, setAfterImageExists] = useState(false);

    useEffect(() => {
        setBeforeImageExists(false);
        setAfterImageExists(false);
        if (beforeImage) {
            const img = new window.Image();
            img.src = beforeImage;
            img.onload = () => setBeforeImageExists(true);
            img.onerror = () => setBeforeImageExists(false);
        }
        if (afterImage) {
            const img = new window.Image();
            img.src = afterImage;
            img.onload = () => setAfterImageExists(true);
            img.onerror = () => setAfterImageExists(false);
        }
    }, [beforeImage, afterImage]);

    return (
        <Card className="group overflow-hidden bg-card-gradient border-border hover:shadow-hover transition-all duration-300 transform hover:scale-105">
            <div className="relative">
                {beforeImageExists && afterImageExists ? (
                    <BeforeAfterSlider
                        beforeImage={beforeImage}
                        afterImage={afterImage}
                        className="aspect-[4/3]"
                    />
                ) : (
                    <img
                        src={`/api/projects/${id}/gallery/0`}
                        alt={title}
                        className="w-full aspect-[4/3] object-cover"
                    />
                )}
                {/* Category Badge */}
                <div className="absolute top-3 left-3 z-10 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                    {category}
                </div>
            </div>

            <CardContent className="p-6">
                <div className="mb-3">
                    <h3 className="font-semibold text-lg text-card-foreground mb-2">{title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <span>{availability}</span>
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
