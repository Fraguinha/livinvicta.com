export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  beforeImage?: string;
  afterImage?: string;
  gallery?: string[];
  galleryImages?: string[];
  features?: string[];
  location?: string;
  price?: string;
  availability?: string;
  featured?: boolean;
}
